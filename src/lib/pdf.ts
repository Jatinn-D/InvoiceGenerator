import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

export async function downloadInvoiceAsPdf(
  node: HTMLElement,
  filename: string,
): Promise<void> {
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready
  }

  const scaledWrapper = node.parentElement
  const sizingWrapper = scaledWrapper?.parentElement
  const prevTransform = scaledWrapper?.style.transform ?? ''
  const prevSizing = {
    width: sizingWrapper?.style.width ?? '',
    height: sizingWrapper?.style.height ?? '',
    overflow: sizingWrapper?.style.overflow ?? '',
  }
  if (scaledWrapper) scaledWrapper.style.transform = 'none'
  if (sizingWrapper) {
    sizingWrapper.style.width = 'auto'
    sizingWrapper.style.height = 'auto'
    sizingWrapper.style.overflow = 'visible'
  }

  let canvas: HTMLCanvasElement
  try {
    canvas = await html2canvas(node, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: node.scrollWidth,
      windowHeight: node.scrollHeight,
    })
  } finally {
    if (scaledWrapper) scaledWrapper.style.transform = prevTransform
    if (sizingWrapper) {
      sizingWrapper.style.width = prevSizing.width
      sizingWrapper.style.height = prevSizing.height
      sizingWrapper.style.overflow = prevSizing.overflow
    }
  }

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  const imgWidth = pageWidth
  const imgHeight = (canvas.height * imgWidth) / canvas.width

  const imgData = canvas.toDataURL('image/png')

  if (imgHeight <= pageHeight) {
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST')
  } else {
    let position = 0
    let heightLeft = imgHeight
    while (heightLeft > 0) {
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST')
      heightLeft -= pageHeight
      position -= pageHeight
      if (heightLeft > 0) pdf.addPage()
    }
  }

  pdf.save(filename)
}
