import { LLamaCloudFileService } from 'llamaindex'
import fs from 'node:fs'
import https from 'node:https'
import path from 'node:path'
import type { SourceEventNode } from './parts'

export async function downloadFile(
  urlToDownload: string,
  downloadedPath: string
) {
  try {
    // Check if file already exists
    if (fs.existsSync(downloadedPath)) return

    const file = fs.createWriteStream(downloadedPath)
    https
      .get(urlToDownload, response => {
        response.pipe(file)
        file.on('finish', () => {
          file.close(() => {
            console.log('File downloaded successfully')
          })
        })
      })
      .on('error', err => {
        fs.unlink(downloadedPath, () => {
          console.error('Error downloading file:', err)
          throw err
        })
      })
  } catch (error) {
    throw new Error(`Error downloading file: ${error}`)
  }
}

/**
 * Returns the full path to a stored file given its id and optional save directory.
 * If saveDir is not provided, defaults to "output/uploaded".
 *
 * @param {Object} params - The parameters object.
 * @param {string} params.id - The file identifier.
 * @param {string} [params.saveDir] - Optional directory to save the file.
 * @returns {string} The full file path.
 */

/**
 * Constructs a stored file path from an ID and optional directory.
 * Uses path.join for cross-platform safety and validates the ID to prevent path traversal.
 *
 * @param {Object} params - The parameters object.
 * @param {string} params.id - The file identifier (must not contain path separators).
 * @param {string} [params.saveDir] - Optional directory to save the file. Defaults to "output/uploaded".
 * @returns {string} The full file path.
 * @throws {Error} If the id contains invalid path characters.
 */
export function getStoredFilePath({
  id,
  saveDir,
}: {
  id: string
  saveDir?: string
}): string {
  // Validate id to prevent path traversal and invalid characters
  if (id.includes('/') || id.includes('\\') || id.includes('..')) {
    throw new Error(
      'Invalid file id: path traversal or separators are not allowed.'
    )
  }
  // Use path.join to construct the default directory for cross-platform compatibility
  const directory = saveDir ?? path.join('output', 'uploaded')
  return path.join(directory, id)
}

export async function downloadLlamaCloudFilesFromNodes(
  nodes: SourceEventNode[]
) {
  const downloadedFiles: string[] = []

  for (const node of nodes) {
    if (!node.url || !node.filePath) continue // skip if url or filePath is not available
    if (downloadedFiles.includes(node.filePath)) continue // skip if file already downloaded
    if (!node.metadata.pipeline_id) continue // only download files from LlamaCloud

    const downloadUrl = await LLamaCloudFileService.getFileUrl(
      node.metadata.pipeline_id,
      node.fileName
    )
    if (!downloadUrl) continue

    await downloadFile(downloadUrl, node.filePath)

    downloadedFiles.push(node.filePath)
  }
}
