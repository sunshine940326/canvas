/***
sine-waves.js
https://github.com/isuttell/sine-waves
 ***/

var waves = new SineWaves({
  el: document.getElementById('waves'),
  
  speed: 4,
  
  width: function() {
    return $(window).width();
  },
  
  height: function() {
    return $(window).height();
  },
  
  ease: 'SineInOut',
  
  wavesWidth: '80%',
  
  waves: [
    {
      timeModifier: 4,
      lineWidth: 2,
      amplitude: -100,
      wavelength: 25
    }, 
    {
      timeModifier: 4,
      lineWidth: 1,
      amplitude: -50,
      wavelength: 20
    }
  ],
 
  // Resize
  resizeEvent: function() {
    var gradient = this.ctx.createLinearGradient(0, 0, this.width, 0);
    gradient.addColorStop(0,"rgba(0,134,141,1)");
    
    var index = -1;
    var length = this.waves.length;
	  while(++index < length){
      this.waves[index].strokeStyle = gradient;
    }
    
    // Clean Up
    index = void 0;
    length = void 0;
    gradient = void 0;
  }
});