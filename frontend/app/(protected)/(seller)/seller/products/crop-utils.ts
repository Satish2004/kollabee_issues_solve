
export const getCroppedImg = (imageSrc: string, crop: any, zoom: number): Promise<File> => {
    return new Promise((resolve, reject) => {
      const image = new Image()
      image.src = imageSrc
      image.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
  
        if (!ctx) {
          reject(new Error("Canvas context not found"))
          return
        }
  
        const naturalWidth = image.naturalWidth
        const naturalHeight = image.naturalHeight
  
        const cropX = (crop.x / 100) * naturalWidth
        const cropY = (crop.y / 100) * naturalHeight
        const cropWidth = (crop.width / 100) * naturalWidth
        const cropHeight = (crop.height / 100) * naturalHeight
  
        canvas.width = cropWidth
        canvas.height = cropHeight
  
        ctx.drawImage(
          image,
          cropX,
          cropY,
          cropWidth,
          cropHeight,
          0,
          0,
          cropWidth,
          cropHeight
        )
  
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("Canvas is empty"))
            return
          }
          const file = new File([blob], "cropped.jpeg", { type: "image/jpeg" })
          resolve(file)
        }, "image/jpeg")
      }
      image.onerror = reject
    })
  }
  