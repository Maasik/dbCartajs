/**
 * World's countrires and flags.
 * egax@bk.ru, 2013
 */
function draw() {
  var centerof, cntrylist = document.getElementById('cntrylist');
  for (var i=0; i<cntrylist.options.length; i++) {
    var opt = cntrylist.options[i];
    if (opt.selected) {
      var m = {};
      m.mpart = opt.value;
      m.cntryname = opt.parentNode.label;
      m.abbr = COUNTRIES[m.cntryname][m.mpart][0];
      m.coords = COUNTRIES[m.cntryname][m.mpart][1];
      m.abbr2 = COUNTRIES[m.cntryname][m.mpart][2].toLowerCase();
      m.centerof = COUNTRIES[m.cntryname][m.mpart][3];
      dw.loadCarta([['Area', m.abbr + m.mpart, m.coords, m.cntryname, m.centerof, true]]);
      dw2.loadCarta([['Area', m.abbr + m.mpart, m.coords, m.cntryname, m.centerof, true]]);
      dw3.loadCarta([['Area', m.abbr + m.mpart, m.coords, m.cntryname, m.centerof, true]]);
      dw4.loadCarta([['Area', m.abbr + m.mpart, m.coords, m.cntryname, m.centerof, true]]);
      if (FLAGSB64[m.abbr2]) {
        var mflg = {};
        mflg[m.abbr2] = new Image();
        mflg[m.abbr2].m = m;
        mflg[m.abbr2].src = FLAGSB64[m.abbr2];
        mflg[m.abbr2].onload = function() {
          var m = this.m;
          dw.loadCarta([{0:'.Image', 1: m.abbr + m.mpart, 2:[m.centerof], 6:this}], 1);
          dw2.loadCarta([{0:'.Image', 1: m.abbr + m.mpart, 2:[m.centerof], 6:this}], 1);
          dw3.loadCarta([{0:'.Image', 1: m.abbr + m.mpart, 2:[m.centerof], 6:this}], 1);
          dw4.loadCarta([{0:'.Image', 1: m.abbr + m.mpart, 2:[m.centerof], 6:this}], 1);
        }
      }
    }
  }
  // draw on centre
  if (m.centerof) {
    var pts = dw.toPoints(m.centerof, true);
    dw.centerCarta(pts[0] + dw.m.offset[0], pts[1] + dw.m.offset[1]);
    dw2.initProj(' +lon_0=' + m.centerof[0] + ' +lat_0=' + m.centerof[1]);
    dw3.initProj(' +lon_0=' + m.centerof[0] + ' +lat_0=' + m.centerof[1]);
    dw4.centerCarta(pts[0] + dw4.m.offset[0], pts[1] + dw4.m.offset[1]);
  }
  dw.draw();
  dw2.draw();
  dw3.draw();
  dw4.draw();
}
function refresh() {
  window.location.reload(false);
}
function init() {
  document.body.style.margin = "0";
  var mtab = document.createElement('table');
  mtab.width = '100%';
  mtab.style.borderCollapse = 'collapse';
  var tb = document.createElement('tbody');
  mtab.appendChild(tb);
  var row = document.createElement('tr');
  row.style.backgroundColor = 'rgb(230,230,230)';
  tb.appendChild(row);

  var col = document.createElement('td');
  col.width = '15%';
  el = document.createElement('h2');
  el.appendChild(document.createTextNode("World's Countries"));
  el.style.margin = '0';
  col.appendChild(el);
  row.appendChild(col);

  var col = document.createElement('td');
  col.colSpan = '2';
  col.align = 'center';
  col.id = 'tcoords';
  row.appendChild(col);

  var row = document.createElement('tr');
  tb.appendChild(row);

  var col = document.createElement('td');
  col.rowSpan = '2';
  col.width = '15%';
  col.style.borderWidth = '1';
  col.style.borderStyle = 'solid';
  col.style.verticalAlign = 'top';
  var el = document.createElement('div');
  el.appendChild(document.createTextNode('Countries by part:'));
  col.appendChild(el);
  var cntrylist = el2 = document.createElement('select');
  el2.id = 'cntrylist'
  el2.multiple='true';
  el2.size = '20';
  el = document.createElement('div');
  el.appendChild(el2);
  col.appendChild(el);
  el = document.createElement('div');
  var el2 = document.createElement('button');
  el2.onclick = draw;
  el2.appendChild(document.createTextNode('show'));
  el.appendChild(el2);
  el2 = document.createElement('button');
  el2.onclick = refresh;
  el2.appendChild(document.createTextNode('refresh'));
  el.appendChild(el2);
  col.appendChild(el);
  row.appendChild(col);

  var col = document.createElement('td');
  col.id = 'canvasmap';
  col.width = '40%';
  row.appendChild(col);
  var col = document.createElement('td');
  col.id = 'canvasmap2';
  col.width = '40%';
  row.appendChild(col);

  var row = document.createElement('tr');
  tb.appendChild(row);

  var col = document.createElement('td');
  col.id = 'canvasmap3';
  col.width = '40%';
  row.appendChild(col);
  var col = document.createElement('td');
  col.id = 'canvasmap4';
  col.width = '40%';
  row.appendChild(col);
  document.body.appendChild(mtab);

  dw = new dbCarta({id:'canvasmap'});
  dw.extend(dw.mopt, {
    'Area': {fg: 'white', bg: 'transparent'}
  });
  dw.cfg.mapbg = undefined; // no draw map area
  // worldmap image
  var im = new Image();
  im.src = 'demodata/img/wrld-small.jpg';
  im.onload = function() {
    dw.loadCarta([{0:'.Image', 1:'wrld', 2:[[-180,90],[180,-90]], 6:this}]);
    dw4.m.bgimg = dw.mflood['.Image_wrld']; // mark as bg
    dw.loadCarta(dw.createMeridians());
    dw.draw();
  }
  dw2 = new dbCarta({id:'canvasmap2'});
  dw2.changeProject(203);
  dw2.scaleCarta(1.5);
  dw2.loadCarta(CONTINENTS);
  dw2.loadCarta(dw2.createMeridians());
  dw2.draw();
  dw3 = new dbCarta({id:'canvasmap3'});
  dw3.changeProject(201);
  dw3.loadCarta(CONTINENTS);
  dw3.loadCarta(dw3.createMeridians());
  dw3.draw();
  dw4 = new dbCarta({id:'canvasmap4'});
  dw4.changeProject(101);
  // worldmap image
  var im4 = new Image();
  im4.src = 'demodata/img/wrld-small-merc.jpg';
  im4.onload = function() {
    dw4.loadCarta([{0:'.Image', 1:'wrld-merc', 2:[[-179.99,84],[179.99,-84]], 6:this}]);
    dw4.m.bgimg = dw.mflood['.Image_wrld-merc']; // mark as bg
    dw4.loadCarta(dw.createMeridians());
    dw4.draw();
  }  
  delete CONTINENTS;
  for (var cntryname in COUNTRIES) {
    el = document.createElement('optgroup');
    el.label = cntryname;
    for (var mpart in COUNTRIES[cntryname]) {
      el2 = document.createElement('option');
      el2.value = mpart;
      el2.appendChild(document.createTextNode(COUNTRIES[cntryname][mpart][0]));
      el.appendChild(el2);
    }
    cntrylist.appendChild(el);
  }
  // curr. object
  var clfunc = function(md) {
    var mcoord = document.getElementById('tcoords');
    var label = '';
    if (md.m.pmap) {
       var o = md.mflood[md.m.pmap];
       label = o['label'];
    }
    mcoord.innerHTML = label;
  }
  dw.clfunc.onmousemove = function(){ clfunc(dw) };
  dw2.clfunc.onmousemove = function(){ clfunc(dw2) };
  dw3.clfunc.onmousemove = function(){ clfunc(dw3) };
  dw4.clfunc.onmousemove = function(){ clfunc(dw4) };
}
