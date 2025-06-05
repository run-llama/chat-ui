import { lazy } from 'react'
import { Button } from '../ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../ui/drawer'

const PDFViewer = lazy(() =>
  import('@llamaindex/pdf-viewer').then(m => ({ default: m.PDFViewer }))
)
const PdfFocusProvider = lazy(() =>
  import('@llamaindex/pdf-viewer').then(m => ({ default: m.PdfFocusProvider }))
)

export interface PdfDialogProps {
  documentId: string
  url: string
  trigger: React.ReactNode
}

export function PdfDialog(props: PdfDialogProps) {
  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>{props.trigger}</DrawerTrigger>
      <DrawerContent className="mt-24 h-full max-h-[96%] w-full md:w-3/5">
        <DrawerHeader className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <div className="space-y-2">
            <DrawerTitle>PDF Content</DrawerTitle>
            <DrawerDescription className="break-all">
              File URL:{' '}
              <a
                className="hover:text-blue-900"
                href={props.url}
                target="_blank"
                rel="noopener"
              >
                {props.url}
              </a>
            </DrawerDescription>
          </div>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              Close
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <div className="m-4">
          <PdfFocusProvider>
            <PDFViewer
              file={{
                id: props.documentId,
                url: props.url,
              }}
            />
          </PdfFocusProvider>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
