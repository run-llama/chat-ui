import json
import re
from typing import List, Optional, Any

from pydantic import ValidationError
from llama_index.core.chat_ui.models.artifact import (
    Artifact,
    ArtifactType,
    CodeArtifactData,
    DocumentArtifactData,
)
from llama_index.core.llms import ChatMessage

INLINE_ANNOTATION_KEY = "annotation"


def get_inline_annotations(message: ChatMessage) -> List[Any]:
    print("message object:", message)

    """Extract inline annotations from a chat message."""
    markdown_content = message.content

    inline_annotations: List[Any] = []

    # Regex to match annotation code blocks
    # Matches ```annotation followed by content until closing ```
    annotation_regex = re.compile(
        rf"```{re.escape(INLINE_ANNOTATION_KEY)}\s*\n([\s\S]*?)\n```", re.MULTILINE
    )

    for match in annotation_regex.finditer(markdown_content):
        json_content = match.group(1).strip() if match.group(1) else None

        if not json_content:
            continue

        try:
            # Parse the JSON content
            parsed = json.loads(json_content)

            # Check for required fields in the parsed annotation
            if (
                not isinstance(parsed, dict)
                or "type" not in parsed
                or "data" not in parsed
            ):
                continue

            # Extract the annotation data
            inline_annotations.append(parsed)
        except (json.JSONDecodeError, ValidationError) as error:
            # Skip invalid annotations - they might be malformed JSON or invalid schema
            print(f"Failed to parse annotation: {error}")

    return inline_annotations


def artifact_from_message(message: ChatMessage) -> Optional[Artifact]:
    """Create an artifact from a chat message if it contains artifact annotations."""
    inline_annotations = get_inline_annotations(message)

    for annotation in inline_annotations:
        if isinstance(annotation, dict) and annotation.get("type") == "artifact":
            try:
                # Create artifact data based on type
                artifact_data = annotation.get("data")
                if not artifact_data:
                    continue

                artifact_type = artifact_data.get("type")

                if artifact_type == "code":
                    code_data = CodeArtifactData(
                        file_name=artifact_data.get("file_name", ""),
                        code=artifact_data.get("code", ""),
                        language=artifact_data.get("language", ""),
                    )
                    artifact = Artifact(
                        created_at=artifact_data.get("created_at"),
                        type=ArtifactType.CODE,
                        data=code_data,
                    )
                elif artifact_type == "document":
                    doc_data = DocumentArtifactData(
                        title=artifact_data.get("title", ""),
                        content=artifact_data.get("content", ""),
                        type=artifact_data.get("type", "markdown"),
                        sources=artifact_data.get("sources"),
                    )
                    artifact = Artifact(
                        created_at=artifact_data.get("created_at"),
                        type=ArtifactType.DOCUMENT,
                        data=doc_data,
                    )
                else:
                    continue

                return artifact
            except Exception as e:
                print(
                    f"Failed to parse artifact from annotation: {annotation}. Error: {e}"
                )

    return None


def get_artifacts(chat_history: List[ChatMessage]) -> List[Artifact]:
    """
    Return a list of artifacts sorted by their creation time.
    Artifacts without a creation time are placed at the end.
    """
    artifacts = []

    for message in chat_history:
        artifact = artifact_from_message(message)
        if artifact is not None:
            artifacts.append(artifact)

    # Sort by creation time, with None values at the end
    return sorted(
        artifacts,
        key=lambda a: (a.created_at is None, a.created_at),
    )


def get_last_artifact(chat_history: List[ChatMessage]) -> Optional[Artifact]:
    """Get the last artifact from chat history."""
    artifacts = get_artifacts(chat_history)
    return artifacts[-1] if len(artifacts) > 0 else None
