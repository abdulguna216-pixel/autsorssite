(function(){
  /* ---- mobile menu ---- */
  var toggle=document.getElementById('menuToggle'),menu=document.getElementById('mobileMenu');
  function closeMenu(){toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Открыть меню');menu.classList.remove('open');document.body.classList.remove('menu-open');}
  toggle.addEventListener('click',function(){
    var open=toggle.getAttribute('aria-expanded')==='true';
    if(open){closeMenu();}else{toggle.setAttribute('aria-expanded','true');toggle.setAttribute('aria-label','Закрыть меню');menu.classList.add('open');document.body.classList.add('menu-open');}
  });
  menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',closeMenu);});
  window.addEventListener('resize',function(){if(window.innerWidth>960)closeMenu();});

  /* ---- reveal ---- */
  var items=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12});
    items.forEach(function(el){io.observe(el);});
  }else{items.forEach(function(el){el.classList.add('in');});}

  /* ---- hero panel animation ---- */
  var big=document.querySelector('.panel-big');
  if(big){
    var target=parseInt(big.dataset.count.replace(/\s/g,''),10),start=null;
    function step(ts){if(!start)start=ts;var p=Math.min((ts-start)/1400,1),e=1-Math.pow(1-p,3);big.textContent=Math.round(target*e).toLocaleString('ru-RU');if(p<1)requestAnimationFrame(step);}
    requestAnimationFrame(step);
    setTimeout(function(){document.querySelectorAll('.bar i').forEach(function(b){b.style.width=b.dataset.w+'%';});},300);
  }

  /* ---- calculator ---- */
  var position=document.getElementById('position'),people=document.getElementById('people'),peopleNum=document.getElementById('peopleNum'),
      weeks=document.getElementById('weeks'),weeksOut=document.getElementById('weeksOut'),hoursGroup=document.getElementById('hours'),graphGroup=document.getElementById('graph'),
      total=document.getElementById('total'),periodText=document.getElementById('periodText'),hoursOut=document.getElementById('hoursOut'),
      shiftOut=document.getElementById('shiftOut'),weekOut=document.getElementById('weekOut'),discountOut=document.getElementById('discountOut'),comment=document.getElementById('leadComment');
  var state={rate:390,people:15,hours:11,days:5,weeks:4};
  var fmt=function(n){return Math.round(n).toLocaleString('ru-RU')+' ₽';};
  function plural(n,f){return n+' '+f[(n%10===1&&n%100!==11)?0:(n%10>=2&&n%10<=4&&(n%100<10||n%100>=20))?1:2];}
  function paint(r){var p=(r.value-r.min)/(r.max-r.min)*100;r.style.setProperty('--p',p+'%');}
  function calc(){
    var shift=state.rate*state.hours, weekSum=shift*state.people*state.days, gross=weekSum*state.weeks;
    var disc=0;
    if(state.people>=100||state.weeks>=12)disc=.1;else if(state.people>=50||state.weeks>=8)disc=.07;else if(state.people>=20)disc=.04;
    var net=gross*(1-disc);
    total.textContent=fmt(net);
    periodText.textContent='за '+plural(state.weeks,['неделю','недели','недель'])+' · '+plural(state.people,['сотрудник','сотрудника','сотрудников']);
    hoursOut.textContent=(state.people*state.hours*state.days*state.weeks).toLocaleString('ru-RU')+' ч';
    shiftOut.textContent=fmt(shift)+' / чел.';
    weekOut.textContent=fmt(weekSum*(1-disc));
    discountOut.textContent=disc?'−'+Math.round(disc*100)+'% ('+fmt(gross-net)+')':'—';
    weeksOut.textContent=plural(state.weeks,['нед.','нед.','нед.']);
    if(comment&&!comment.dataset.touched){comment.value=position.options[position.selectedIndex].text.split(' — ')[0]+' — '+state.people+' чел., смена '+state.hours+' ч, график '+(state.days===7?'без выходных':state.days+'/'+(7-state.days))+', срок '+plural(state.weeks,['неделя','недели','недель'])+'. Предварительно: '+fmt(net);}
    paint(people);paint(weeks);
  }
  
  position.addEventListener('change',function(){state.rate=+this.value;calc();});
  
  // Обработчики для слайдера "Количество сотрудников"
  function updatePeople(){state.people=+people.value;peopleNum.value=people.value;calc();}
  people.addEventListener('input',updatePeople);
  people.addEventListener('change',updatePeople);
  people.addEventListener('touchend',updatePeople);
  people.addEventListener('pointerup',updatePeople);
  people.addEventListener('mouseup',updatePeople);
  
  // Обработчики для ввода числа сотрудников
  function updatePeopleNum(){var v=Math.min(200,Math.max(1,parseInt(peopleNum.value,10)||1));state.people=v;people.value=v;calc();}
  peopleNum.addEventListener('input',updatePeopleNum);
  peopleNum.addEventListener('change',updatePeopleNum);
  peopleNum.addEventListener('blur',function(){this.value=state.people;});
  
  // Обработчики для слайдера "Срок проекта"
  function updateWeeks(){state.weeks=+weeks.value;calc();}
  weeks.addEventListener('input',updateWeeks);
  weeks.addEventListener('change',updateWeeks);
  weeks.addEventListener('touchend',updateWeeks);
  weeks.addEventListener('pointerup',updateWeeks);
  weeks.addEventListener('mouseup',updateWeeks);
  
  function segment(group,key){
    group.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;group.querySelectorAll('button').forEach(function(x){x.classList.remove('active');});b.classList.add('active');state[key]=+b.dataset.v;calc();});
  }
  segment(hoursGroup,'hours');segment(graphGroup,'days');
  if(comment)comment.addEventListener('input',function(){this.dataset.touched='1';});
  
  // Инициализация слайдеров
  if(people){paint(people);}
  if(weeks){paint(weeks);}
  
  calc();

  /* ---- FAQ ---- */
  document.querySelectorAll('.faq-item button').forEach(function(btn){
    btn.addEventListener('click',function(){var item=btn.parentElement,open=item.classList.contains('open');document.querySelectorAll('.faq-item.open').forEach(function(i){i.classList.remove('open');});if(!open)item.classList.add('open');});
  });

  /* ---- lead form ---- */
  var form=document.getElementById('leadForm');
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var ok=true;
    form.querySelectorAll('[required]').forEach(function(f){if(!f.value.trim()){ok=false;f.style.borderColor='#e5484d';f.addEventListener('input',function(){f.style.borderColor='';},{once:true});}});
    if(!ok)return;
    var btn=form.querySelector('button');btn.disabled=true;btn.textContent='Отправляем…';
    
    // Отправка в Telegram
    var inputs=form.querySelectorAll('input, textarea');
    var telegramToken='8690817128:AAE6oQb6QHpCy5sVcvD1Q-iIRd9b5tTPQ_M';
    var telegramChatId='8239527177';
    var msg='📋 Заявка: '+inputs[0].value+' | '+inputs[1].value+' | '+inputs[2].value+' | '+inputs[3].value+' | '+inputs[4].value;
    var img=new Image();
    img.src='https://api.telegram.org/bot'+telegramToken+'/sendMessage?chat_id='+telegramChatId+'&text='+encodeURIComponent(msg);
    
    setTimeout(function(){form.classList.add('sent');},700);
  });

  /* ---- phone mask ---- */
  var tel=form.querySelector('input[type=tel]');
  tel.addEventListener('input',function(){
    var d=this.value.replace(/\D/g,'');if(d[0]==='8')d='7'+d.slice(1);if(d[0]!=='7'&&d.length)d='7'+d;d=d.slice(0,11);
    var r='+7';if(d.length>1)r+=' ('+d.slice(1,4);if(d.length>=4)r+=') '+d.slice(4,7);if(d.length>=7)r+='-'+d.slice(7,9);if(d.length>=9)r+='-'+d.slice(9,11);
    this.value=d.length?r:'';
  });
})();
