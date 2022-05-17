const range = party.variation.range
party.settings.gravity = 2400

window.go_ = () => {
  let btn = document.getElementById('targ')
	party.confetti(btn, {
		count: range(100, 100),
		speed: range(600,1200),
		spread: 80,
		
	})
}

window.addEventListener('message', e => {
  const key = e.message ? 'message' : 'data';
  const data = e[key];
  if (data == 'transfer_success') {
  	window.go_()
  }
    
},false)
