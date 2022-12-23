const video = document.querySelector('video')
const showText = document.querySelector('[data-text]')
const copyButton = document.querySelector('#copyButton')

copyButton.addEventListener('click', async() => {
    if(!showText.innerText){
        return
    }else {
       await navigator.clipboard.writeText(showText.innerText)
        copyButton.innerText = 'copied'
        setTimeout( () => {
             copyButton.innerText = 'copy'
        },2000)
    }
})

 async function setup () {
    const stream = await navigator.mediaDevices.getUserMedia({video:true})
    video.srcObject = stream

    video.addEventListener('playing', async() => {
        const worker = await Tesseract.createWorker()

        await worker.load()
        await worker.loadLanguage('eng')
        await worker.initialize('eng')

        const canvas = document.createElement('canvas')
        canvas.width = video.width
        canvas.height = video.height

        document.addEventListener('keypress',async e => {
         if(e.code !== 'Space') return

            canvas.getContext('2d').drawImage(video, 0, 0, video.width, video.height) // draw video and put on canvas
            const { data:{ text }} = await worker.recognize(canvas)
             showText.innerText = text
             if(showText.innerText){
                showText.innerText += text
                ReadOutText(text)
             }
             ReadOutText(text)
        })

    })
 }

 function ReadOutText(text) {
     const synth = window.speechSynthesis
     const utterThis = new SpeechSynthesisUtterance(text)
     synth.speak(utterThis)
 }

 setup()
