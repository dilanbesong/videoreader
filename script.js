const video = qs('video')
const showText = qs('[data-text]')
const copyButton = qs('#copyButton')
const captureButton = qs('.capture')

function qs(selector, parent=document){
    return parent.querySelector(selector)
}
captureButton.addEventListener('click', () => {
    if( !showText.innerText) {
        alert('please show some written text on the video screen to capture')
       
    }else{ 
        captureButton.textContent = 'capturing...'
        setTimeout( () => {
        captureButton.textContent = 'capture text'
        }, 5000)
        CaptureAndDisplay(showText) 
    }
    
})

copyButton.addEventListener('click', async() => {
    if(!showText.innerText){
        alert( 'please show some written text on the video screen to capture before copying' )
        
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

        document.addEventListener('keypress',async e => {
         if(e.code !== 'Space') return
            CaptureAndDisplay(showText)
        })

    })
 }

 async function CaptureAndDisplay(showText) {

     const worker = await Tesseract.createWorker()

        await worker.load()
        await worker.loadLanguage('eng')
        await worker.initialize('eng')

     const canvas = document.createElement('canvas')
        canvas.width = video.width
        canvas.height = video.height

    canvas.getContext('2d').drawImage(video, 0, 0, video.width, video.height) // draw video and put on canvas
    const { data:{ text }} = await worker.recognize(canvas)
        showText.innerText = text
        if(showText.innerText){
        showText.innerText += text
        ReadOutText(text)
        }
        ReadOutText(text)
 }

 function ReadOutText(text) {
     const synth = window.speechSynthesis
     const utterThis = new SpeechSynthesisUtterance(text.replace(/\s/g, " "))
     synth.speak(utterThis)
 }

 setup()
