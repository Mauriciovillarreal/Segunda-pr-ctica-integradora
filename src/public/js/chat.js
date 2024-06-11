const socket = io()

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#messageForm')
  const input = document.querySelector('#m')
  const messages = document.querySelector('#messages')
  const emailInput = document.querySelector('#email')
  const chatList = document.querySelector('.containerChat')

  input.addEventListener('input', () => {
    input.style.width = `${input.scrollWidth}px`
  })

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    if (input.value && emailInput.value) {
      const message = {
        user: emailInput.value,
        message: input.value
      }
      socket.emit('chat message', message)
      input.value = ''
    }
  })
  
  chatList.addEventListener('DOMNodeInserted', () => {
    chatList.scrollTop = chatList.scrollHeight
  })

  socket.on('chat message', (msg) => {
    const isMine = msg.user === emailInput.value
    const item = document.createElement('li')
    item.textContent = `${msg.user}: ${msg.message}`
    item.className = isMine ? 'mine' : 'other'
    messages.appendChild(item)
    messages.scrollTop = messages.scrollHeight
  })

})


