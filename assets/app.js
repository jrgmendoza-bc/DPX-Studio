(function () {
  'use strict';

  var ACCENT = '#EAE7DF';
  var ON = 'background:' + ACCENT + ';color:#141414;border:1px solid ' + ACCENT;
  var OFF = 'background:#1d1d1d;color:#EAE7DF;border:1px solid #3a3a3a';

  var BARBERS = [
    { id: 'any', name: 'First available', role: 'Any barber, soonest chair', initials: 'DPX' },
    { id: 'b1', name: 'Barber One', role: '[Role / specialty]', initials: 'B1' },
    { id: 'b2', name: 'Barber Two', role: '[Role / specialty]', initials: 'B2' },
    { id: 'b3', name: 'Barber Three', role: '[Role / specialty]', initials: 'B3' }
  ];
  var SERVICES = [
    { id: 'cut', label: 'Haircut' },
    { id: 'beard', label: 'Beard trim' },
    { id: 'combo', label: 'Haircut + beard' },
    { id: 'shave', label: 'Hot towel shave' },
    { id: 'kids', label: 'Kids haircut' }
  ];
  var TIMES = ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'];
  var DOWS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  var state = { barber: 'any', service: 'cut', day: 0, time: '', name: '', phone: '' };

  var now = new Date();
  var DAYS = [];
  for (var i = 0; i < 7; i++) {
    var d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    DAYS.push({ dow: i === 0 ? 'Today' : DOWS[d.getDay()], num: d.getDate(), label: DOWS[d.getDay()] + ' ' + d.getDate() });
  }

  var el = function (id) { return document.getElementById(id); };
  var barbersEl = el('barbers'), chipsEl = el('service-chips'), daysEl = el('days'), slotsEl = el('slots');
  var submit = el('submit'), formPane = el('form-pane'), donePane = el('done-pane');
  var nameInput = el('f-name'), phoneInput = el('f-phone');
  var summaries = document.querySelectorAll('.summary');

  function isTaken(dayIdx, slotIdx) { return (dayIdx * 7 + slotIdx * 3) % 5 === 0; }

  function render() {
    barbersEl.innerHTML = BARBERS.map(function (b) {
      var sel = state.barber === b.id;
      return '<button type="button" class="card" data-barber="' + b.id + '" aria-pressed="' + sel + '" style="flex:1 1 200px;min-width:0;max-width:260px;display:flex;flex-direction:column;gap:10px;padding:14px;border-radius:6px;text-align:left;font-size:16px;' + (sel ? ON : OFF) + '">' +
        '<div aria-hidden="true" style="height:96px;border-radius:4px;background:repeating-linear-gradient(90deg,#222 0 10px,#2c2c2c 10px 12px,#1a1a1a 12px 22px);display:flex;align-items:center;justify-content:center;border:1px solid #3a3a3a"><span class="disp" style="font-size:22px;color:#EAE7DF">' + b.initials + '</span></div>' +
        '<span class="disp" style="font-size:14px;letter-spacing:.08em;text-align:left">' + b.name + '</span>' +
        '<span style="font-size:14px;opacity:.75;text-align:left">' + b.role + '</span></button>';
    }).join('');

    chipsEl.innerHTML = SERVICES.map(function (s) {
      var sel = state.service === s.id;
      return '<button type="button" class="chip btn" data-service="' + s.id + '" aria-pressed="' + sel + '" style="padding:14px 20px;border-radius:4px;font-size:15px;font-weight:600;' + (sel ? ON : OFF) + '">' + s.label + '</button>';
    }).join('');

    daysEl.innerHTML = DAYS.map(function (dy, idx) {
      var sel = state.day === idx;
      return '<button type="button" class="chip btn" data-day="' + idx + '" aria-pressed="' + sel + '" style="min-width:56px;display:flex;flex-direction:column;align-items:center;gap:2px;padding:10px 8px;border-radius:4px;' + (sel ? ON : OFF) + '"><span style="font-size:12px;letter-spacing:.1em;text-transform:uppercase">' + dy.dow + '</span><span style="font-size:18px;font-weight:700">' + dy.num + '</span></button>';
    }).join('');

    slotsEl.innerHTML = TIMES.map(function (t, idx) {
      var taken = isTaken(state.day, idx);
      var sel = state.time === t && !taken;
      var style = taken ? 'background:#141414;color:#6b6a66;border:1px solid #2a2a2a;text-decoration:line-through' : (sel ? ON : OFF);
      return '<button type="button" class="chip btn" data-time="' + t + '"' + (taken ? ' disabled' : '') + ' aria-pressed="' + sel + '" style="padding:11px 14px;border-radius:4px;font-size:14px;font-variant-numeric:tabular-nums;' + style + '">' + t + '</button>';
    }).join('');

    var barber = BARBERS.filter(function (b) { return b.id === state.barber; })[0];
    var service = SERVICES.filter(function (s) { return s.id === state.service; })[0];
    var when = state.time ? DAYS[state.day].label + ', ' + state.time : 'pick a time';
    var text = service.label + ' with ' + barber.name + ' · ' + when;
    for (var k = 0; k < summaries.length; k++) summaries[k].textContent = text;

    var ready = !!(state.time && state.name.trim() && state.phone.trim());
    submit.disabled = !ready;
    submit.style.background = ready ? ACCENT : '#1d1d1d';
    submit.style.color = ready ? '#141414' : '#8c8b85';
    submit.style.borderColor = ready ? ACCENT : '#3a3a3a';
  }

  function closest(target, attr) {
    while (target && target !== document) {
      if (target.getAttribute && target.hasAttribute(attr)) return target;
      target = target.parentNode;
    }
    return null;
  }

  document.addEventListener('click', function (e) {
    var b = closest(e.target, 'data-barber');
    if (b) { state.barber = b.getAttribute('data-barber'); return render(); }
    var s = closest(e.target, 'data-service');
    if (s) { state.service = s.getAttribute('data-service'); return render(); }
    var d = closest(e.target, 'data-day');
    if (d) { state.day = parseInt(d.getAttribute('data-day'), 10); state.time = ''; return render(); }
    var t = closest(e.target, 'data-time');
    if (t && !t.disabled) { state.time = t.getAttribute('data-time'); return render(); }
  });

  nameInput.addEventListener('input', function () { state.name = nameInput.value; render(); });
  phoneInput.addEventListener('input', function () { state.phone = phoneInput.value; render(); });

  submit.addEventListener('click', function () {
    if (submit.disabled) return;
    formPane.hidden = true;
    donePane.hidden = false;
  });

  el('reset').addEventListener('click', function () {
    state.time = ''; state.name = ''; state.phone = '';
    nameInput.value = ''; phoneInput.value = '';
    donePane.hidden = true;
    formPane.hidden = false;
    render();
  });

  render();
})();
