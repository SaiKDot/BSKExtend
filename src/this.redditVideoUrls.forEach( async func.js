    this.redditVideoUrls.forEach( async function (url) {
      // var filename = 'element' + count + '.png' // 1
      console.log(url.name)
      let filename = url.name
      let resUrl = url.url
      const imageBlob = await fetch(resUrl).then((response) => { counter++; return response.blob()}) 
      console.log('wew',imageBlob);
      const imgData = new File([imageBlob], filename)
      zip.file(filename, imgData)
      if(counter = so.redditVideoUrls.length) {
        zip.generateAsync({ type: 'blob' }).then(function (content) {
          let blob = content
          var resource = window.URL.createObjectURL(blob)
          so.url = resource
          so.downloadFile()
        })
      }
    })