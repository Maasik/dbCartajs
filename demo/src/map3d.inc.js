/**
 * Projection map 3D r1.
 * It uses WebGL rendering by Three.js framework.
 * View maps in different projections.
 * Ported from Spinnable World Maps at
 *   http://vcg.isti.cnr.it/~tarini/spinnableworldmaps/
 * egax@bk.ru, 2015.
 */
function initMap() {

  if (!Detector.webgl) { // require webgl support
    document.body.appendChild(Detector.getWebGLErrorMessage());
    return;
  }

  // canvas 2d layers
  var mopt = {
    countries: {cls: 'Polygon', fg: 'yellow', bg: 'transparent', labelcolor: 'white', hide:1},
    meridians: {cls: 'Line', fg: 'rgb(164,164,164)'},
    satsurface: {cls: 'Dot', fg: 'rgba(255,255,220,0.9)', size: '2'},
    sattrace: {cls: 'Line', fg: 'rgb(255,255,0)'},
    terminator: {cls: 'Polygon', fg: 'rgba(0,0,0,0.3)', bg: 'rgba(0,0,0,0.3)'}
  };

  var wDivisions = 80,
      hDivisions = 60;
  var ratio = 0;
  var geometry;
  var vertexOnSphere;
  // list sat
  var msat = {};

  // MAPS

  function buildEquirectangular(){
    ratio = 0.5;
    geometry = new THREE.Geometry();
    vertexOnSphere = [];
    buildRectangularMap(f_equirectangular);
  }

  function buildCassini(){
    ratio = 0.5;
    geometry = new THREE.Geometry();
    vertexOnSphere = [];
    buildRectangularMap(f_equirectangular);
    var matrixZ = new THREE.Matrix4();
    matrixZ.makeRotationZ(Math.PI * 0.5);
    var matrixX = new THREE.Matrix4();
    matrixX.makeRotationX(Math.PI * 0.5);
    var matrix = new THREE.Matrix4();
    matrix.makeRotationY(Math.PI * 0.5);
    matrix.multiply(matrixX).multiply(matrixZ);
    for (var i = 0; i < geometry.vertices.length; i++){
      vertexOnSphere[i].applyMatrix4(matrix);
      geometry.vertices[i].applyMatrix4(matrixZ);
      var vec = geometry.vertices[i];
      vec.y *= ratio * camera.aspect;
      vec.x /= 2 * camera.aspect;
    }
  }

  function buildLambert(){
    ratio = 1/Math.PI;
    geometry = new THREE.Geometry();
    vertexOnSphere = [];
    buildRectangularMap(f_lambert);
  }

  function buildBehrmann(){
    ratio = 1/2.36;
    geometry = new THREE.Geometry();
    vertexOnSphere = [];
    buildRectangularMap(f_lambert);
  }

  function buildHoboDyer(){
    ratio = 0.509;
    geometry = new THREE.Geometry();
    vertexOnSphere = [];
    buildRectangularMap(f_lambert);
  }

  function buildGallStereo(){
    ratio = 0.77;
    geometry = new THREE.Geometry();
    vertexOnSphere = [];
    buildRectangularMap(f_gallStereo);
    var matrix = new THREE.Matrix4();
    matrix.makeRotationY(Math.PI);
    for (var i = 0; i < geometry.vertices.length; i++){
      vertexOnSphere[i].applyMatrix4(matrix);
    }
  }
  
  function buildGallPeters(){
    ratio = 0.6387;
    geometry = new THREE.Geometry();
    vertexOnSphere = [];
    buildRectangularMap(f_gallPeters);
  }

  function buildAzimuthal(){
    ratio = 1;
    geometry = new THREE.Geometry();
    vertexOnSphere = [];
    buildCircleMap(0, 0, f_azimuthal);
    var matrix = new THREE.Matrix4();
    matrix.makeRotationY(Math.PI);
    for (var i = 0; i < geometry.vertices.length; i++){
      vertexOnSphere[i].applyMatrix4(matrix);
    }
  }

  function buildLambertAzimuthal(){
    ratio = 1;
    geometry = new THREE.Geometry();
    vertexOnSphere = [];
    buildCircleMap(0, 0, f_lambertAzimuthal);
    var matrix = new THREE.Matrix4();
    matrix.makeRotationY(Math.PI/2);
    for (var i = 0; i < geometry.vertices.length; i++){
      vertexOnSphere[i].applyMatrix4(matrix);
    }
  }

  function buildMercator(){
    ratio = 0.84889;
    geometry = new THREE.Geometry();
    vertexOnSphere = [];
    buildRectangularMap(f_mercator);
  }

  function buildMiller(){
    ratio = 0.734375;
    geometry = new THREE.Geometry();
    vertexOnSphere = [];
    buildRectangularMap(f_miller);
  }

  function buildOcta(){
    ratio = 1;
    geometry = new THREE.Geometry();
    vertexOnSphere = [];
    buildOctaMap(f_octa);
  }

  function buildOrthographic(){
    ratio = 0.5;
    var vertices = 0;
    geometry = new THREE.Geometry();
    vertexOnSphere = [];
    vertices = buildCircleMap(-1, vertices, f_orthographic);
    buildCircleMap(1, vertices, f_orthographic);
  }

  function buildStereographic(){
    ratio = 0.5;
    geometry = new THREE.Geometry();
    vertexOnSphere = [];
    var vertices = 0;
    vertices = buildCircleMap(-1, vertices, f_stereographic);
    buildCircleMap(1, vertices, f_stereographic);
    var matrix = new THREE.Matrix4();
    matrix.makeRotationY(Math.PI);
    for (var i = 0; i < geometry.vertices.length; i++){
      vertexOnSphere[i].applyMatrix4(matrix);
    }
  }

  function buildGrinten(){
    ratio = 1;
    geometry = new THREE.Geometry();
    vertexOnSphere = [];
    buildCircleMap(0, 0, f_grinten);
    var matrix = new THREE.Matrix4();
    matrix.makeRotationY(Math.PI);
    for (var i = 0; i < geometry.vertices.length; i++){
      vertexOnSphere[i].applyMatrix4(matrix);
    }
  }

  function buildMollweide(){
    ratio = 0.5;
    geometry = new THREE.Geometry();
    vertexOnSphere = [];
    buildEllipticalMap(f_mollweide);
    var matrix = new THREE.Matrix4();
    matrix.makeRotationY(Math.PI);
    for (var i = 0; i < geometry.vertices.length; i++){
      vertexOnSphere[i].applyMatrix4(matrix);
    }
  }

  function buildAitoff(){
    ratio = 0.5;
    geometry = new THREE.Geometry();
    vertexOnSphere = [];
    buildEllipticalMap(f_aitoff);
    var matrix = new THREE.Matrix4();
    matrix.makeRotationY(Math.PI);
    for (var i = 0; i < geometry.vertices.length; i++){
      vertexOnSphere[i].applyMatrix4(matrix);
    }	
  }		

  function buildHammer(){
    ratio = 0.5;
    geometry = new THREE.Geometry();
    vertexOnSphere = [];
    buildEllipticalMap(f_hammer);
    var matrix = new THREE.Matrix4();
    matrix.makeRotationY(Math.PI);
    for (var i = 0; i < geometry.vertices.length; i++){
      vertexOnSphere[i].applyMatrix4(matrix);
    }	
  }	

  function buildKavraiskiy(){
    ratio = 0.58;
    geometry = new THREE.Geometry();
    vertexOnSphere = [];
    buildPseudoEllipticalMap(f_kavraiskiy);
    var matrix = new THREE.Matrix4();
    matrix.makeRotationY(Math.PI);
    for (var i = 0; i < geometry.vertices.length; i++){
      vertexOnSphere[i].applyMatrix4(matrix);
    }
  }

  function buildCubeMap(){
    ratio = 0.75;
    geometry = new THREE.Geometry();
    vertexOnSphere = [];
    buildCube(f_cube);
    var matrix = new THREE.Matrix4();
    matrix.makeRotationY(Math.PI/2);
    for (var i = 0; i < geometry.vertices.length; i++){
      vertexOnSphere[i].applyMatrix4(matrix);
    }
  }

  function buildCollignon(){
    ratio = 0.503;
    geometry = new THREE.Geometry();
    vertexOnSphere = [];
    buildCollignonMap(f_collignon);			
  }

  function buildHEALPix(){
    ratio = 0.5;
    geometry = new THREE.Geometry();
    vertexOnSphere = [];
    buildHEALPiMap(f_healpix);
  }

  function buildLambertConic(){
    //costanti proiezione
    var o1 = 0.349;
    var o2 = 0.873;
    var o0 = Math.PI/2;
    var n = Math.log(Math.cos(o1)* 1/Math.cos(o2)) / (Math.log(Math.tan( 0.25*Math.PI +0.5 * o2)* 1/(Math.tan( 0.25*Math.PI +0.5 * o1))));
    var f = Math.cos(o1)* Math.exp(Math.tan(0.25*Math.PI +0.5 * o1),n)/n;
    var p0= f * Math.exp(1/Math.tan(0.25*Math.PI +0.5 *o0),n);
    var signN = n>=0 ? 1 : -1;
    var args = new Array(n,f,p0,signN);
    //crazione mappa
    ratio = 0.6275;
    geometry = new THREE.Geometry();
    vertexOnSphere = [];
    buildConicMap(3.655, true, args, f_lConic);
  }

  function buildAlbersConic(){
    //costanti proiezione
    var o1 = 0;
    var o2 = 1;
    var o0 = 0;
    var n = 0.5 * ( Math.sin(o1) + Math.sin(o2));
    var c = Math.exp(Math.cos(o1),2)+ 2*n*Math.sin(o1);
    var p0 = Math.sqrt(c-2*n*Math.sin(o0))/n;
    var args = new Array(n,c,p0);
    //crazione mappa
    ratio = 0.6;
    geometry = new THREE.Geometry();
    vertexOnSphere = [];
    buildConicMap(3, false, args, f_albers);
  }

  function buildDymaxion(){
    ratio = GDYMAXION.ratio;
    geometry = new THREE.Geometry();
    vertexOnSphere = [];
    var v, currentVertex;
    for (var i=0; i<GDYMAXION.vertexOnSphere.length; i++) {
      v = GDYMAXION.vertexOnSphere[i];
      vertexOnSphere.push(new THREE.Vector4(v[0], v[1], v[2], 0));
    }
    for (var i=0; i<GDYMAXION.vertices.length; i++) {
      v = GDYMAXION.vertices[i];
      currentVertex = new THREE.Vector3(v[0], v[1], v[2]);
      geometry.vertices.push( (currentVertex) );
    }
    for (var i=0; i<GDYMAXION.faces.length; i++) {
      v = GDYMAXION.faces[i];
      geometry.faces.push(new THREE.Face3(v[0], v[1], v[2]));
    }
    rotationMatrix = new THREE.Matrix4(-0.7866391674760586,-0.4127417074743772,-0.45917654894790655,0,
                                    0.4252814425598584,-0.901370892378135,  0.08164685534453028,0,
                                    -0.44758743816910174,-0.13105265081096362,0.8845850371268104,0,
                                    0,0,0,1);
  }

  function buildButterfly(){
    ratio = GBUTTERFLY.ratio;
    geometry = new THREE.Geometry();
    vertexOnSphere = [];
    var v, currentVertex;
    for (var i=0; i<GBUTTERFLY.vertexOnSphere.length; i++) {
      v = GBUTTERFLY.vertexOnSphere[i];
      vertexOnSphere.push(new THREE.Vector4(v[0], v[1], v[2], 0));
    }
    for (var i=0; i<GBUTTERFLY.vertices.length; i++) {
      v = GBUTTERFLY.vertices[i];
      currentVertex = new THREE.Vector3(v[0], v[1], v[2]);
      geometry.vertices.push( (currentVertex) );
    }
    for (var i=0; i<GBUTTERFLY.faces.length; i++) {
      v = GBUTTERFLY.faces[i];
      geometry.faces.push(new THREE.Face3(v[0], v[1], v[2]));
    }
  }

  // ----------------------------

  function buildConicMap(radiants, fan, args, f){
    //punto centrale 
    var center = new THREE.Vector3(0, 0, 0);
    geometry.vertices.push(center);
    vertexOnSphere.push(f(center.x, center.y, args));
    var currentVertex;
    var startAngle = (Math.PI-radiants)/2;
    //generazione vertici
    for (var j=1;j<=20;j++){
      var radius = (j /20)*Math.sin(Math.PI * j / 40); 
      for (var i = 0; i <=wDivisions; i ++ ) {
        var angle = (i / wDivisions * radiants)+startAngle;
        currentVertex = new THREE.Vector3(Math.cos(angle)*radius, -Math.sin(angle)*radius, 0);
        vertexOnSphere.push(f(currentVertex.x, currentVertex.y, args));
        geometry.vertices.push(normalCoords(currentVertex));
      }
    }
    //offsetY
    var offsetY = (1 - geometry.vertices[geometry.vertices.length-1].y);
    for(var i=0; i< geometry.vertices.length; i++){
      geometry.vertices[i].y += offsetY;
    }
    //generazione facce parte fan
    if(fan)
      for (var i = 1; i <=wDivisions; i ++ )
        geometry.faces.push(new THREE.Face3(i+1, i, 0));
    //generazione facce strips
    var skip = fan ? 0 : 7;
    for(var j = 1+skip ; j<20;j++){
      var start=j*(wDivisions+1)+1;
      for (var i =0; i <wDivisions ; i++ ){
        var v1 = start-wDivisions -1+i , v2 = v1 + 1;
        var v3 = start+i, v4 = v3 + 1;
        geometry.faces.push(new THREE.Face3(v3, v1, v2));
        geometry.faces.push(new THREE.Face3(v4, v3, v2));
      }
    }
  }

  function buildCircleMap(quadrant, vertices, f){
    //punto centrale
    var center = new THREE.Vector3(quadrant * 0.5, 0, 0);
    vertexOnSphere.push(f(center.x, center.y));
    geometry.vertices.push(normalCoords(center));
    var currentVertex;
    //generazione vertici
    for (var j=1;j<=20;j++){
      var radius = 0.5 * Math.sin(Math.PI * j / 40);
      if(quadrant==0)radius*=2;
      for (var i = 0; i <wDivisions; i ++ ) {
        var angle = i / wDivisions * 2 * Math.PI;
        currentVertex = new THREE.Vector3(Math.cos(angle)*radius+0.5*quadrant, Math.sin(angle)*radius, 0);
        vertexOnSphere.push(f(currentVertex.x, currentVertex.y));
        geometry.vertices.push(normalCoords(currentVertex));
      }
    }
    //generazione facce parte fan
    for (var i = 1; i <=wDivisions; i ++ )
      if(i==wDivisions)geometry.faces.push(new THREE.Face3(i+vertices,  vertices + 1, vertices));
      else geometry.faces.push(new THREE.Face3(i+vertices, i + vertices + 1, vertices));
    //generazione facce strips
    for (var i = wDivisions+1; i <=(wDivisions) *20; i++ ){
      var v1 = i-wDivisions + vertices, v2 = v1 + 1;
      var v3 = i +vertices, v4 = i + vertices+ 1;
      if(i % wDivisions == 0){
        v2 -= wDivisions;
        v4 -= wDivisions;
      }
      geometry.faces.push(new THREE.Face3(v1, v4, v2));
      geometry.faces.push(new THREE.Face3(v1, v3, v4));
    }
    vertices = geometry.vertices.length;
    return vertices;
  }

  function buildCube(f){
    var wDivisions = 48,
        hDivisions = 35;
    hDivisions=Math.ceil(hDivisions/3);
    var wStep = 2/wDivisions;
    var hStep = 2/hDivisions * ratio;
    var currentVertex;
    //generazione vertici striscia centrale
    for (var i=0; i<=hDivisions; i++)
      for (var j=0; j<=wDivisions; j++){
        currentVertex = new THREE.Vector3(wStep * j -1 , (hStep * i -ratio)/3 , 0);
        vertexOnSphere.push(f(currentVertex.x, currentVertex.y));
        geometry.vertices.push(normalCoords(currentVertex));
      }
    //generazione facce
    var v1,v2,v3,v4;
    for (var i=0; i<hDivisions; i++)
      for (var j=0; j<wDivisions; j++){
        v1 = i * (wDivisions + 1) + j;
        v2 = v1 + 1;
        v3 = v1 + wDivisions + 1;
        v4 = v3 + 1;
        geometry.faces.push(new THREE.Face3(v1, v2, v3));
        geometry.faces.push(new THREE.Face3(v2, v4, v3));
      }
    var qDivisions=Math.floor(wDivisions/4);
    //generazione vertici quadrato alto
    for (var i=0; i<=qDivisions; i++)
      for (var j=0; j<=qDivisions; j++){
        currentVertex = new THREE.Vector3(wStep * j -0.5 , (hStep * i -ratio)/3+0.5 , 0);
        vertexOnSphere.push(f(currentVertex.x, currentVertex.y));
        geometry.vertices.push(normalCoords(currentVertex));
      }
    //generazione facce
    for (var i=0; i<hDivisions; i++)
      for (var j=0; j<qDivisions; j++){
        v1 = (i+wDivisions+1) * (qDivisions + 1) + j;
        v2 = v1 + 1;
        v3 = v1 + qDivisions + 1;
        v4 = v3 + 1;
        geometry.faces.push(new THREE.Face3(v1, v2, v3));
        geometry.faces.push(new THREE.Face3(v2, v4, v3));
      }
    //generazione vertici quadrato basso
    for (var i=0; i<=qDivisions; i++)
      for (var j=0; j<=qDivisions; j++){
        currentVertex = new THREE.Vector3(wStep * j -0.5 , (hStep * i -ratio)/3-0.5 , 0);
        vertexOnSphere.push(f(currentVertex.x, currentVertex.y));
        geometry.vertices.push(normalCoords(currentVertex));
      }
    //generazione facce
    for (var i=0; i<hDivisions; i++)
      for (var j=0; j<qDivisions; j++){
        v1 = (i+wDivisions+qDivisions+2) * (qDivisions + 1) + j;
        v2 = v1 + 1;
        v3 = v1 + qDivisions + 1;
        v4 = v3 + 1;
        geometry.faces.push(new THREE.Face3(v1, v2, v3));
        geometry.faces.push(new THREE.Face3(v2, v4, v3));
      }
  }

  function buildPseudoEllipticalMap(f){
    //punto centrale 
    var center = new THREE.Vector3(0, 0, 0);
    geometry.vertices.push(center);
    vertexOnSphere.push(f(center.x, center.y));
    var currentVertex;
    //generazione vertici
    for (var j=1;j<=20;j++){
      var radius = 0.5 * Math.sin(Math.PI * j / 40); 
      for (var i = 0; i <=wDivisions*2; i ++ ) {
        var angle = i / wDivisions * Math.PI;
        var y = Math.sin(angle)*radius * 1.3 ;
        if(y>=0.583) currentVertex = new THREE.Vector3(Math.cos(angle)*radius*2, 0.583, 0);
        else if(y<= -0.583) currentVertex = new THREE.Vector3(Math.cos(angle)*radius*2, -0.583, 0);
        else currentVertex = new THREE.Vector3(Math.cos(angle)*radius*2, y, 0);
        vertexOnSphere.push(f(currentVertex.x, currentVertex.y));
        geometry.vertices.push(normalCoords(currentVertex));
      }	
    }		
    //generazione facce parte fan 
    for (var i = 1; i <=wDivisions*2; i ++ )
      geometry.faces.push(new THREE.Face3(i, i + + 1, 0));
    //generazione facce strips
    for (var i = wDivisions*2+1; i < (wDivisions*2+1) *20; i++ ){
      var v1 = i-wDivisions*2, v2 = v1 + 1;
      var v3 = i, v4 = i + 1;
      geometry.faces.push(new THREE.Face3(v1, v4, v2));
      geometry.faces.push(new THREE.Face3(v1, v3, v4)); 
    }	
  }

  function buildEllipticalMap(f){
    //punto centrale
    var center = new THREE.Vector3(0, 0, 0);
    geometry.vertices.push(center);
    vertexOnSphere.push(f(center.x, center.y));
    var currentVertex;
    for (var j=1;j<=20;j++){
      var radius = 0.5 * Math.sin(Math.PI * j / 40);
      for (var i = 0; i <=wDivisions*2; i ++ ) {
        var angle = i / wDivisions * Math.PI;
        currentVertex = new THREE.Vector3(Math.cos(angle)*radius*2, Math.sin(angle)*radius, 0);
        vertexOnSphere.push(f(currentVertex.x, currentVertex.y));
        geometry.vertices.push(normalCoords(currentVertex));
      }
    }
    //generazione facce parte fan
    for (var i = 1; i <=wDivisions*2; i ++ )
      geometry.faces.push(new THREE.Face3(i, i + + 1, 0));
    //generazione facce strips
    for (var i = wDivisions*2+1; i < (wDivisions*2+1) *20; i++ ){
      var v1 = i-wDivisions*2, v2 = v1 + 1;
      var v3 = i, v4 = i + 1;
      geometry.faces.push(new THREE.Face3(v1, v4, v2));
      geometry.faces.push(new THREE.Face3(v1, v3, v4));
    }
  }

  function tessellateTriangles(triangles, times, f){
    //loop
    while(times>0){
      var newTriangles=new Array();
      //generazione nuovi triangoli
      for(var t=0; t < triangles.length; t++){
        var triangle = triangles[t];
        var v1 = new THREE.Vector3();
        v1.addVectors(triangle.a, triangle.b).divideScalar(2);
        var v2 = new THREE.Vector3();
        v2.addVectors(triangle.b, triangle.c).divideScalar(2);
        var v3 = new THREE.Vector3();
        v3.addVectors(triangle.c, triangle.a).divideScalar(2);
        newTriangles.push(new THREE.Triangle(triangle.a,v1, v3));
        newTriangles.push(new THREE.Triangle(v1,triangle.b, v2));
        newTriangles.push(new THREE.Triangle(v3,v2,triangle.c));
        newTriangles.push(new THREE.Triangle(v2,v3,v1));
      }
      triangles = newTriangles;
      times--;
    }
    // generazione geometria
    for(var t=0; t < triangles.length; t++){
      var triangle = triangles[t];
      var newVertex = new THREE.Vector3();
      newVertex.addVectors(triangle.a, triangle.b).divideScalar(2);
      var a = abnormalCoords(triangle.a.clone()),
          b = abnormalCoords(triangle.b.clone()),
          c = abnormalCoords(triangle.c.clone()),
          d = abnormalCoords(newVertex.clone());
      vertexOnSphere.push(f(a.x, a.y));
      vertexOnSphere.push(f(b.x, b.y));
      vertexOnSphere.push(f(c.x, c.y));
      vertexOnSphere.push(f(d.x, d.y));
      geometry.vertices.push((triangle.a));
      geometry.vertices.push((triangle.b));
      geometry.vertices.push((triangle.c));
      geometry.vertices.push((newVertex));
      var l = geometry.vertices.length;
      geometry.faces.push(new THREE.Face3(l-4, l-1, l-2));
      geometry.faces.push(new THREE.Face3(l-1, l-3, l-2));
    }
  }

  function buildCollignonMap(f){
    var triangles = new Array();
    var v0 = normalCoords(new THREE.Vector3(-1, 0, 0));
    var v1 = normalCoords(new THREE.Vector3( 1, 0, 0));
    var v2 = normalCoords(new THREE.Vector3( 0,  ratio, 0));
    var v3 = normalCoords(new THREE.Vector3( 0, -ratio, 0));
    triangles.push(new THREE.Triangle(v0, v1, v2));
    triangles.push(new THREE.Triangle(v1, v0, v3));
    tessellateTriangles(triangles,5,f);
  }

  function buildHEALPiMap(f){
    //parte centrale
    var wStep = 2/wDivisions;
    var hStep = 0.93/hDivisions * ratio;
    var currentVertex;
    //generazione vertici
    for (var i=0; i<=hDivisions; i++)
      for (var j=0; j<=wDivisions; j++){
        currentVertex = new THREE.Vector3(wStep * j -1 , hStep * i -ratio + 0.2675 , 0);
        vertexOnSphere.push(f(currentVertex.x, currentVertex.y));
        geometry.vertices.push(normalCoords(currentVertex));
      }
    //generazione facce
    var v1,v2,v3,v4;
    for (var i=0; i<hDivisions; i++)
      for (var j=0; j<wDivisions; j++){
        v1 = i * (wDivisions + 1) + j;
        v2 = v1 + 1;
        v3 = v1 + wDivisions + 1;
        v4 = v3 + 1;
        geometry.faces.push(new THREE.Face3(v1, v2, v3));
        geometry.faces.push(new THREE.Face3(v2, v4, v3));
      }
    //triangoli
    var limit = 0.2325;
    var triangles = new Array();
    for(var i=0; i<8;i++){
      var sign = i>3 ? -1: 1;
      v1 = normalCoords(new THREE.Vector3((-1+i%4*0.5), limit*sign, 0));
      v2 = normalCoords(new THREE.Vector3((-0.5+i%4*0.5),limit*sign , 0));
      v3 = normalCoords(new THREE.Vector3((-0.75+i%4*0.5), ratio*sign, 0));
      if(i<4)triangles.push(new THREE.Triangle(v1, v2, v3));
      else triangles.push(new THREE.Triangle(v2, v1, v3));
    }
    tessellateTriangles(triangles,4,f);
  }

  function buildRectangularMap(f){
    var wStep = 2/wDivisions,
        hStep = 2/hDivisions * ratio;
    var currentVertex,v1,v2,v3,v4;
    for (var i=0; i<=hDivisions; i++){
      for (var j=0; j<=wDivisions; j++){
        currentVertex = new THREE.Vector3(wStep * j -1 , hStep * i -ratio, 0);
        vertexOnSphere.push(f(currentVertex.x, currentVertex.y));
        geometry.vertices.push(normalCoords(currentVertex));
        //generazione facce
        v1 = (i-1) * (wDivisions + 1) + (j-1);
        v2 = v1 + 1;
        v3 = v1 + wDivisions + 1;
        v4 = v3 + 1;
        if (v1 >= 0) {
          geometry.faces.push(new THREE.Face3(v1, v2, v3));
          geometry.faces.push(new THREE.Face3(v2, v4, v3));
        }
      }
    }
  }

  //geometria mappe rettangolari x octamap
  function buildOctaMap(f){
    var wStep = 2/wDivisions;
    var currentVertex;
    //generazione vertici
    for (var i=0; i<=wDivisions; i++)
      for (var j=0; j<=wDivisions; j++){
        currentVertex = new THREE.Vector3(wStep * j -1 , wStep * i -ratio, 0);
        vertexOnSphere.push(f(currentVertex.x, currentVertex.y));
        geometry.vertices.push(normalCoords(currentVertex));
      }
    //generazione facce 
    var v1,v2,v3,v4;
    for (var i=0; i<wDivisions; i++)
      for (var j=0; j<wDivisions; j++){
        v1 = i * (wDivisions + 1) + j; 
        v2 = v1 + 1;
        v3 = v1 + wDivisions + 1;
        v4 = v3 + 1;
        var vertex = geometry.vertices[v2];
        var vertex2 = geometry.vertices[v3];
        if(vertex.x <= 0 && vertex.y >= 0){
          geometry.faces.push(new THREE.Face3(v1, v4, v3));
          geometry.faces.push(new THREE.Face3(v2, v4, v1)); 
        } else if (vertex2.x >= 0 && vertex2.y <= 0){
          geometry.faces.push(new THREE.Face3(v1, v4, v3));
          geometry.faces.push(new THREE.Face3(v2, v4, v1)); 
        } else {
         geometry.faces.push(new THREE.Face3(v1, v2, v3));
         geometry.faces.push(new THREE.Face3(v2, v4, v3)); 
        }
      }
  }

  // ---------------------------

  function f_equirectangular(u, v){
    //da [-1..1]x[-k..k] a [-Pi..Pi]x[-k Pi..kPi]
    var _u = u * Math.PI + Math.PI ;
    var _v = v * Math.PI;
    //da lat/long a 3D
    var x,y,z;
    z = Math.cos(_v) * Math.sin(_u);
    y = Math.sin(_v);
    x = Math.cos(_v) * Math.cos(_u);
    return new THREE.Vector4(x, y, z, 0);
  }

  function f_lambert(u, v){
    //da [-1..1]x[-k..k] a [-Pi..Pi]x[-k Pi..kPi]
    var _u = u * Math.PI + Math.PI ;
    var _v = v /ratio;
    //da uv a lat/lon
    var phi = Math.asin(_v);
    var lambda = _u;
    //da lat/long a 3D
    var x,y,z;
    z = Math.cos(phi) * Math.sin(lambda) ;
    y = Math.sin(phi);
    x = Math.cos(phi) * Math.cos(lambda);
    return new THREE.Vector4(x, y, z, 0);
  }

  function f_gallStereo(u, v){
    //da [-1..1]x[-k..k] a [-Pi..Pi]x[-k Pi..kPi]
    var _u = u * Math.PI;
    var _v = v / 2 * Math.PI * Math.sqrt(2);
    //da uv a lat/lon
    var phi = Math.atan2(_v, 1 + Math.sqrt(2) / 2) * 2;
    var lambda = _u;
    //da lat/long a 3D
    var x,y,z;
    z = Math.cos(phi) * Math.sin(lambda);
    y = Math.sin(phi);
    x = Math.cos(phi) * Math.cos(lambda);
    return new THREE.Vector4(x, y, z, 0);
  }

  function f_gallPeters(u,v){
    //da [-1..1]x[-k..k] a [-Pi..Pi]x[-k Pi..kPi]
    var _u = u * Math.PI + Math.PI;
    var _v = v * Math.PI;
    //da uv a lat/lon
    var phi = Math.asin(_v/2);
    if(isNaN(phi)){
      var temp =Math.floor(_v/2);
      if (temp<0)temp+=1;
      phi = Math.asin(temp);
    }
    var lambda = _u;
    //da lat/long a 3D
    var x,y,z;
    z = Math.cos(phi) * Math.sin(lambda);
    y = Math.sin(phi);
    x = Math.cos(phi) * Math.cos(lambda);
    return new THREE.Vector4(x, y, z, 0);
  }

  function f_mercator(u, v){
    //da [-1..1]x[-k..k] a [-Pi..Pi]x[-k Pi..kPi]
    var _u = u * Math.PI + Math.PI ;
    var _v = v * Math.PI;
    //da uv a lat/lon
    var phi = 2 * Math.atan(Math.exp(_v)) - Math.PI / 2;
    var lambda = _u;
    //da lat/long a 3D
    var x,y,z;
    z = Math.cos(phi) * Math.sin(lambda) ;
    y = Math.sin(phi);
    x = Math.cos(phi) * Math.cos(lambda);
    return new THREE.Vector4(x, y, z, 0);
  }

  function f_miller(u, v){
    //da [-1..1]x[-k..k] a [-Pi..Pi]x[-k Pi..kPi]
    var _u = u * Math.PI + Math.PI ;
    var _v = v * Math.PI;
    //da uv a lat/lon
    var phi = 2.5 * Math.atan(Math.pow(Math.E, 0.8*_v)) - 0.625 * Math.PI;
    var lambda = _u;
    //da lat/long a 3D
    var x,y,z;
    z = Math.cos(phi) * Math.sin(lambda) ;
    y = Math.sin(phi);
    x = Math.cos(phi) * Math.cos(lambda);
      return new THREE.Vector4(x, y, z, 0);
  }

  function f_octa(u, v){
    var h = 1 - Math.abs(u) - Math.abs(v);
    var signU = (u<0) ? -1 : 1;
    var signV = (v<0) ? -1 : 1;
    var x,y,z;
    if (h>=0){
      x = u; z = v; y = h;
    } else if (signU== signV){
      z = signU * (1- Math.abs(u));
      x = signV * ( 1-Math.abs(v));
      y = h;
    } else {
      z = -signU * (1- Math.abs(u));
      x = -signV * ( 1-Math.abs(v));
      y = h;
    }
    return new THREE.Vector4(x, y, z, 0).normalize();
  }

  function f_octaT(u, v){
    if (u<=0 && v>=0){
      u = u * 2 + 1;
      v = v * 2 - 1; 
    } else if (u>0 && v>=0){
      u = -u * 2 + 1;
      v = -v * 2 + 1; 
    } else if (u<=0 && v<0){
      u = -u * 2 - 1;
      v = -v * 2 - 1;
    } else {
      u = u * 2 - 1;
      v = v * 2 + 1; 
    }
    return f_octa(u, v);
  }

  function f_orthographic(u, v){
    //da [-1..1]x[-k..k] a [-1..1..-1]x[-1..1]
    v*=2;
    var q=0;
    if(u<0){
      q=-1;
      u = 2*u +1;
    }
    else if(u>0){
      u = -2*u +1;
      q=1;
    }
    else u = 1;
    //a x,y,z
    var x,y,z;
    x = -u;
    y = v;
    if (q==1)z =-Math.sqrt(1 - x*x - y*y);
    else z = Math.sqrt(1 - x*x - y*y);
    var vector = new THREE.Vector4(x, y, z, 0);
    var rotMatrix = new THREE.Matrix4();
    rotMatrix.makeRotationY( -90 * Math.PI/180 );
    vector.applyMatrix4(rotMatrix);
    return vector;
  }

  function f_stereographic(u, v){
    //da [-1..1]x[-k..k] a [-1..1..-1]x[-1..1]
    v*=2;
    var q=0;
    if(u<0){
      q=-1;
      u = 2*u +1;
    }
    else if(u>0){
      u = -2*u +1;
      q=1;
    }
    else u = 1;
    //a x,y,z
    var x,y,z;
    var den = 1 + u * u + v * v;
    x = 2 * u / den;
    y = 2 * v / den;
    if(q==1)z = -(u * u + v * v - 1) / den;
    else z = (u * u + v * v - 1) / den;
    return new THREE.Vector4(x, y, z, 0);
  }

  function f_grinten(u, v){
    //da uv a lat/lon
    var c1 = -Math.abs(v)*(1+u*u+v*v);
    var c2 = c1 - 2*v*v + u*u;
    var c3 = -2*c1 + 1 + 2*v*v + (u*u+v*v)*(u*u+v*v);
    var d = v*v/c3 + 1/27 *(2*Math.pow(c2, 3)/ Math.pow(c3, 3) - 9*c1*c2/(c3*c3));
    var a1 = 1/c3 * (c1 - c2*c2/(3*c3));
    var m1 = 2*Math.sqrt(-1/3*a1);
    var o1 = 1/3*Math.acos(3*d/(a1*m1));
    var sign = (v<0) ? -1 : 1;	
    if (isNaN(o1)){
      var temp =Math.floor(3*d/(a1*m1));
      if (temp<0)temp+=1;
      o1 = 1/3*Math.acos(temp);
    }
    var phi = sign * Math.PI * ( -m1 * Math.cos( o1 + 1/3 * Math.PI)- c2/(3*c3) );
    var lambda = (Math.PI * Math.abs( u*u + v*v -1 + Math.sqrt( 1+2* (u*u-v*v)+ (u*u+v*v) * (u*u+v*v) ))) /(2*u);
    //correzioni
    if( Math.abs(u)<0.00001 && Math.abs(v)<0.16){
      phi = v*Math.PI;
      lambda=0;
    }
    //da lat/long a 3D
    var x,y,z;
    z = Math.cos(phi) * Math.sin(lambda) ;
    y = Math.sin(phi);
    x = Math.cos(phi) * Math.cos(lambda);
    return new THREE.Vector4(x, y, z, 0);
  }

  function f_mollweide(u, v){
    //da [-1..1]x[-k..k] a [-Pi..Pi]x[-k Pi..kPi]
    var _u = u * 2 * Math.sqrt(2);
    var _v = v * 2 * Math.sqrt(2);
    //da uv a lat/long
    var o = Math.asin(_v/Math.sqrt(2));
    var phi = Math.asin((2*o + Math.sin(2*o))/Math.PI);
    var lambda = (Math.PI *_u) / (2*Math.sqrt(2)*Math.cos(o));
    //da lat/long a 3D
    var x,y,z;
    z = Math.cos(phi) * Math.sin(lambda) ;
    y = Math.sin(phi);
    x = Math.cos(phi) * Math.cos(lambda);
    return new THREE.Vector4(x, y, z, 0);
  }

  function f_aitoff(u, v){
    //da [-1..1]x[-k..k] a [-Pi..Pi]x[-k Pi..kPi]
    var _u = u * Math.PI * 0.50;
    var _v = v * Math.PI;
    //da uv a lat/lon
    var phi;
    var lambda;
    var c = Math.sqrt(_v*_v + _u*_u);
    if (c==0){
      phi = 0;
      lambda = 0;
    } else {
      phi = Math.asin(_v * Math.sin(c) / c);
      lambda = Math.atan2(_u * Math.sin(c), c * Math.cos(c));
    }
    lambda *=2;
    //da lat/long a 3D
    var x,y,z;
    z = Math.cos(phi) * Math.sin(lambda);
    y = Math.sin(phi);
    x = Math.cos(phi) * Math.cos(lambda);
    return new THREE.Vector4(x, y, z, 0);
  }
		
  function f_hammer(u, v){
    //da [-1..1]x[-k..k] a [-Pi..Pi]x[-k Pi..kPi]
    var _u = u * 2 * Math.sqrt(2);
    var _v = v * 2 * Math.sqrt(2);
    //da uv a lat/lon
    var serv = Math.sqrt(1 - (0.25 * _u)*(0.25 * _u) - (0.5 * _v)*(0.5 * _v));
    var phi = Math.asin(serv * _v);
    var lambda = 2 * Math.atan2(serv * _u, 2*(2 * serv * serv -1 ));
    //da lat/long a 3D
    var x,y,z;
    z = Math.cos(phi) * Math.sin(lambda);
    y = Math.sin(phi);
    x = Math.cos(phi) * Math.cos(lambda);
    return new THREE.Vector4(x, y, z, 0);
  }
		
  function f_kavraiskiy(u, v){
    //da [-1..1]x[-k..k] a [-Pi..Pi]x[-k Pi..kPi]
    var _u = u * Math.PI * 0.869;
    var _v = v * Math.PI * 0.869;
    //da uv a lat/lon
    var phi = _v;
    var lambda = 2 *_u /( 3* Math.sqrt(1/3 - (_v/Math.PI)*(_v/Math.PI)) );
    //da lat/long a 3D
    var x,y,z;
    z = Math.cos(phi) * Math.sin(lambda);
    y = Math.sin(phi);
    x = Math.cos(phi) * Math.cos(lambda);
    return new THREE.Vector4(x, y, z, 0);
  }

  function f_azimuthal(u, v){
    //da [-1..1]x[-k..k] a [-Pi..Pi]x[-k Pi..kPi]
    var _u = u * Math.PI  ;
    var _v = v * Math.PI;
    //da uv a lat/lon
    var phi ;
    var lambda ;
    var c = Math.sqrt(_v*_v + _u*_u);
    if (c==0){
      phi = 0;
      lambda = 0;
    } else {
      phi = Math.asin(_v * Math.sin(c) / c);
      lambda = Math.atan2(_u * Math.sin(c), c * Math.cos(c));
    }
    //da lat/long a 3D
    var x,y,z;
    z = Math.cos(phi) * Math.sin(lambda) ;
    y = Math.sin(phi);
    x = Math.cos(phi) * Math.cos(lambda);
    return new THREE.Vector4(x, y, z, 0);
  }

  function f_lambertAzimuthal(u, v){
    u*=2;
    v*=2;
    var rad = Math.sqrt(1 - (u*u+v*v)/4);
    var x = rad * u;
    var y = rad * v;
    var z = (u*u+v*v)/2 -1;
    return new THREE.Vector4(x, y, z, 0);
  }

  function f_cube(u, v){
    var x=0,y=0,z=0;
    //up
    if (v>0.25 && v<=0.75){
      x=u*4+1;
      y=1;
      z= v *4 -2;
    //down
    } else if (v<-0.25){
      x=u*4+1;
      y=-1;
      z= -v *4 -2;
    //sx
    } else if (u<-0.5){
      x=-1;
      y= v*4;
      z= -1*(u *4 +3);
    //center
    } else if (u<0){
      x=(u*4+1);
      y= v*4;
      z= -1;
    //dx
    } else if(u<0.5){
      x= 1;
      y= v*4;
      z= u * 4 - 1;
    //rear
    } else {
      x= -1*( u * 4 - 3);
      y= v*4;
      z= 1;
    }
    return new THREE.Vector4(x, y, z, 0).normalize();
  }

  function f_collignon(u, v){
    //da [-1..1]x[-k..k] a [-Pi..Pi]x[-k Pi..kPi]
    var _u = u*Math.PI;
    var _v = v*Math.PI*2;
    //da uv a lat/lon
    var o = 1-Math.abs(_v)/Math.PI;
    var c = -Math.PI + (2*Math.floor( (_u+Math.PI)/(Math.PI*2) )+1 )*Math.PI;
    var sign = _v>0 ? 1 : -1;
    var phi = sign*Math.asin( 1- o*o);
    var lambda =c+(_u-c)/o + Math.PI;	
    //da lat/long a 3D
    var x,y,z;
    z = Math.cos(phi) * Math.sin(lambda) ;
    y = Math.sin(phi);
    x = Math.cos(phi) * Math.cos(lambda);
    return new THREE.Vector4(x, y, z, 0);	
  }

  function f_healpix(u,v){
    //da [-1..1]x[-k..k] a [-Pi..Pi]x[-k Pi..kPi]
    var _u = u*Math.PI+Math.PI;
    var _v = v*Math.PI;
    //da uv a lat/lon
    var lambda;
    var phi;
    if(v>-0.25 && v<0.25){
      phi = Math.asin(_v*8/(3*Math.PI));
      lambda =_u;
    } else {
      var o = 2-Math.abs(_v*4)/Math.PI;
      var c = -Math.PI + (2*Math.floor( (_u+Math.PI)*2/Math.PI )+1 )*Math.PI/4;
      var sign = _v>0 ? 1 : -1;
      phi = sign*Math.asin(1- o*o/3);
      lambda =c+(_u-c)/o;
    }
    //da lat/long a 3D
    var x,y,z;
    z = Math.cos(phi) * Math.sin(lambda);
    y = Math.sin(phi);
    x = Math.cos(phi) * Math.cos(lambda);
    return new THREE.Vector4(x, y, z, 0);
  }

  function f_lConic(u, v, args){
    //variabili globali proiezione
    var n  = args[0];
    var f  = args[1];
    var p0 = args[2];
    var signN = args[3];
    //da [-1..1]x[-k..k] a [-Pi..Pi]x[-k Pi..kPi]
    var _u = u * 2 * Math.PI * Math.PI;
    var _v = (v+0.34) * 2 * Math.PI * Math.PI;
    //da uv a lat/lon
    var p = signN * Math.sqrt(_u*_u + Math.pow(p0-_v,2));
    var o = Math.atan2(_u,(p0-_v));
    var lambda =o/n + Math.PI;
    var phi = 2 *Math.atan( Math.pow(f/p, 1/n) ) - 0.5*Math.PI;
    //da lat/long a 3D
    var x,y,z;
    z = Math.cos(phi) * Math.sin(lambda);
    y = Math.sin(phi);
    x = Math.cos(phi) * Math.cos(lambda);
    return new THREE.Vector4(x, y, z, 0);
  }

  function f_albers(u, v, args){
    //variabili globali proiezione
    var n  = args[0];
    var c  = args[1];
    var p0 = args[2];
    //da [-1..1]x[-k..k] a [-Pi..Pi]x[-k Pi..kPi]
    var _u = u/1.2;
    var _v = (v+0.5)/1.5*2;
    //da uv a lat/lon
    var p = Math.sqrt(_u*_u + Math.pow(p0-_v,2));
    var o = Math.atan2(_u,(p0-_v));
    var lambda =(o/n + Math.PI)  ;
    var phi = Math.asin( (c - p*p*n*n)/(2*n)  );
    //da lat/long a 3D
    var x,y,z;
    z = Math.cos(phi) * Math.sin(lambda);
    y = Math.sin(phi);
    x = Math.cos(phi) * Math.cos(lambda);
    return new THREE.Vector4(x, y, z, 0);
  }

  // ---------------------------

  function normalCoords(vec) {
    if (ratio < 1/camera.aspect){
      vec.y *= camera.aspect;
    } else {
      vec.x /= ratio * camera.aspect;
      vec.y /= ratio;
    }
    return vec;
  }

  function abnormalCoords(vec) {
    if (ratio < 1/camera.aspect){
      vec.y /= camera.aspect;
    } else {
      vec.x *= ratio * camera.aspect;
      vec.y *= ratio;
    }
    return vec;
  }

  // Day/Night zone
  function terminator(time) {
    var sunpos = Solar.loadSun(time),
        srect = MVector.spheric2rect(sunpos[0], sunpos[1]),
        sgeo = MVector.rect2geo(time, srect[0], srect[1], srect[2]);
    var s = MGeo.bigcircle1spheric(sgeo[0], sgeo[1], 5),
        isnight = MGeo.isnight(srect, 179.99, ylimit),
        ylimit = 89.99; // fix mercator
    if (isnight) s.push([179.99,ylimit]); else s.push([179.99,-ylimit]);
    if (isnight) s.push([-179.99,ylimit]); else s.push([-179.99,-ylimit]);
    s.push(s[0]);
    return s;
  }

  function layers() {
    var m = {};
    for (var i in mopt) if (!mopt[i]['hide']) m[i] = mopt[i];
    return m;
  }

  // Return Date
  function getSelTime(){
    return new Date(
      Number(document.getElementById('yy').value),
      Number(document.getElementById('mm').value)-1,
      Number(document.getElementById('dd').value),
      Number(document.getElementById('hh').value),
      Number(document.getElementById('mi').value),
      Number(document.getElementById('ss').value) );
  }

  // Convert to UTC
  function getSelUTC(dtm){
    return [ dtm.getUTCFullYear(),
             dtm.getUTCMonth()+1,
             dtm.getUTCDate(),
             dtm.getUTCHours(),
             dtm.getUTCMinutes(),
             dtm.getUTCSeconds() ];
  }

  // Set date/time in controls
  function setSelTime(interval){
    if (interval) {
      var st = getSelTime(),
          tt = st.getTime();
      var dtm = new Date(tt + interval);
    } else {
      var dtm = new Date();
//      var dtm = new Date(2010, 12-1, 22, 7, 33, 0);
    }
    document.getElementById('yy').value = dtm.getFullYear();
    document.getElementById('mm').value = dtm.getMonth()+1;
    document.getElementById('dd').value = dtm.getDate();
    document.getElementById('hh').value = dtm.getHours();
    document.getElementById('mi').value = dtm.getMinutes();
    document.getElementById('ss').value = dtm.getSeconds();
  }

  // Start/stop timer
  function setAutoTime() {
    if (window.autotime) {
      window.autotime = window.clearInterval(window.autotime);
      document.getElementById('btauto').textContent = '▶';
    } else {
      window.autotime = setInterval(function() {
        setSelTime(500*500);
        update();
      }, 50);
      document.getElementById('btauto').textContent = '◼';
    }
  }

  // -------------------------------

  var removeLayer = function(name, group) {
    var m = group.getObjectByName(name);
    if (m) {
      group.remove(m);
      if (m.geometry) m.geometry.dispose();
    }
  }

  var addLayer = function(name, group, mesh) {
    removeLayer(name, group);
    mesh.name = name;
    group.add(mesh);
  };

  function render() {
    dw.render(scene, camera);
  }

  // Update map
  function update(mlayers) {
    mlayers = mlayers || layers();
    var gmtime = getSelUTC(getSelTime());
    var sat = {};

    canvas.clearCarta();
    for (var i in canvas.mflood) {
      switch (canvas.mflood[i]['ftype']) {
      case 'countries':
      case 'meridians':
      case 'terminator':
      case 'sattrace':
      case 'satsurface':
        delete canvas.mflood[i];
      }
    }

    for (var ftype in mlayers) {
      switch (ftype) {

      case 'map':

//        rotateXY(1,1);
        break;

      case 'countries':

        var cnts = COUNTRIES;
        for (var i in cnts) {
          for (var j in cnts[i]) {
            canvas.loadCarta([[ftype, cnts[i][j][0], cnts[i][j][1]]], 1);
          }
        }
        break;

      case 'meridians':

        var x = -180;
        while (x <= 180) {
          var lon = [];
          var y = -80;
          while (y <= 80) {
            lon.push([x, y]);
            y += 5;
          }
          canvas.loadCarta([[ftype, [x, y].toString(), lon]]);
          x += 20;
        }
        var y = -80;
        while (y <= 80) {
          var lat = [];
          var x = -180;
          while (x <= 180) {
            lat.push([x, y]);
            x += 5;
          }
          canvas.loadCarta([[ftype, [x, y].toString(), lat]]);
          y += 20;
        }
        break;

      case 'terminator':

        var term = terminator(gmtime);
        canvas.loadCarta([[ftype, '1', term]], 1);
        break;

      case 'sattrace':
      case 'satsurface':

        var tledata = TLEDATA.GLONASS;
        for (var i in tledata){
          if (!tledata[i])
            continue; // check data
          if (msat[tledata[i][0]])
            continue; // skip hidden
          if (!sat[i]) {
            var satrec = satellite.twoline2satrec(tledata[i][1], tledata[i][2]);
            // orbital period
            var utc1 = Date.UTC(gmtime[0], gmtime[1]-1, gmtime[2], gmtime[3], gmtime[4], gmtime[5]),
                ps = 2.0 * Math.PI * 60.0/satrec.no, // rad.per min to 2 period
                delta = 0, step = ps / 200.0, vrect = [], vgeo = [];
            while (delta <= ps) {
              var utc2 = new Date();
              utc2.setTime(utc1 - delta * 1000);
              var pv = satellite.propagate(satrec, utc2.getUTCFullYear(), utc2.getUTCMonth()+1, utc2.getUTCDate(), utc2.getUTCHours(), utc2.getUTCMinutes(), utc2.getUTCSeconds()),
                  gmst = satellite.gstime_from_date(utc2.getUTCFullYear(), utc2.getUTCMonth()+1, utc2.getUTCDate(), utc2.getUTCHours(), utc2.getUTCMinutes(), utc2.getUTCSeconds()),
                  pgeo = satellite.eci_to_geodetic(pv['position'], gmst);
              delta += step;
              vrect.push([pv['position']['x'], pv['position']['y'], pv['position']['z']]);
              vgeo.push([MUtil.ang180(pgeo['longitude'] * 180/Math.PI), MUtil.ang90(pgeo['latitude'] * 180/Math.PI)]);
            }
            sat[i] = {
              mcoords: vgeo
            };
          }
          var mcoords = sat[i]['mcoords'];
          if (ftype == 'satsurface') {
            canvas.loadCarta([[ftype, i, [mcoords[0]]]], 1);
            // center sat.surface
            rotationMatrix.identity();
            rotateXY(mcoords[0][0], 0);
          }
          // surface trace
          if (ftype == 'sattrace') {
            var trace = [];
            for (var j in mcoords)
              if (mcoords[j-1] && mcoords[j][0] - mcoords[j-1][0] < 90)
                trace.push([ftype, i + '.' + j, [mcoords[j-1], mcoords[j]]]);
            canvas.loadCarta(trace, 1);
          }
        }
        break;

      }
    }
    canvas.draw();
    layerTexture.needsUpdate = true;
    render();
  }

  // Create map
  function init(){
    // canvas 3d
    var material = new THREE.ShaderMaterial( {
      uniforms: {
        texture1 : { type: "t", value: layerTexture },
        rotMatrix :{ type: "m4", value: rotationMatrix }
      },
      attributes: {
        spherePosition : {type: "v4", value: vertexOnSphere }
      },
      vertexShader: [
        'attribute vec3 spherePosition;',
        'varying vec3 spherePoint;',
        'uniform mat4 rotMatrix;',
        'void main() {',
          'spherePoint = (vec4 (spherePosition, 1.0) * rotMatrix).rgb;',
          'gl_Position = vec4(position, 1.0);',
        '}'
      ].join("\n"),
     fragmentShader: [
        '#extension GL_OES_standard_derivatives : enable',
        '#define M_PiDOUBLEINVERSE 0.159154943091895',
        '#define M_PiINVERSE       0.318309886183790',
        '#define N 16.0',
        'vec2 g (vec3 point) ;',
        'varying vec3 spherePoint;',
        'uniform sampler2D texture1;',
        'void main(void) {',
          'vec2 newUv = g(normalize(spherePoint));',
          'vec4 mapColor = texture2D(texture1, newUv );',
          'gl_FragColor = 1.0 * mapColor;',
        '}',
        'vec2 g (vec3 point){',
          'vec2 pointMap = vec2 (atan(point.z, point.x),asin(point.y));',
          'pointMap.x = (pointMap.x * M_PiDOUBLEINVERSE < 0.0)? pointMap.x * M_PiDOUBLEINVERSE + 1.0 : pointMap.x * M_PiDOUBLEINVERSE ;',
          'pointMap.y = pointMap.y * M_PiINVERSE + 0.5 ;',
          'return  pointMap;',
        '}'
      ].join("\n")
    });
    var mesh = new THREE.Mesh(geometry,  material);
    addLayer('map', scene, mesh);

    // canvas 2d
    canvas.loadCarta([{0:'.Image', 1:'wrld'}]);
    var im = new Image();
    im.src = IMGMAP['wrld_small'];
    im.onload = function() {
      canvas.loadCarta([{0:'.Image', 1:'wrld', 2:[[-180,90],[180,-90]], 6:this}]);
      update();
    };
    render();
  }

  function resize() {
    var w = mcol.offsetWidth, h = mcol.offsetHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    dw.setSize( w, h );
    dw.domElement.style.width = '100%';
    dw.domElement.style.height = '100%';
  }

  function rotateXY(x, y){
    var rotMatrix = new THREE.Matrix4(),
        m = new THREE.Matrix4();
    rotMatrix.multiply(m.makeRotationZ( y * Math.PI/180 ));
    rotMatrix.multiply(m.makeRotationY( x * Math.PI/180 ));
    rotate(rotMatrix);
  }

  function rotate(rotMatrix){
    var newMat = new THREE.Matrix4();
    newMat.multiplyMatrices(rotationMatrix, rotMatrix);
    var elements = newMat.elements;
    var v1=new THREE.Vector3(elements[0], elements[1], elements[2]);
    var v2=new THREE.Vector3(elements[4], elements[5], elements[6]);
    var v3=new THREE.Vector3();
    v3.crossVectors(v1, v2);
    v2.crossVectors(v3, v1);
    v1.normalize();
    v2.normalize();
    v3.normalize();
    if(v1.x != 0 &&  v2.y!= 0 && v3.z!=0) {
      rotationMatrix.set(v1.x, v2.x, v3.x, 0,
                         v1.y, v2.y, v3.y, 0,
                         v1.z, v2.z, v3.z, 0,
                         0,  0,    0,    1);
    }
  }

  // ----------------------

  function canvasXY(ev) {
    var cw = dw.domElement.offsetWidth,
        pw = dw.domElement.width,
        ch = dw.domElement.offsetHeight,
        ph = dw.domElement.height;
    var node = ev.target,
        pts = [ev.clientX, ev.clientY];
    if (!/WebKit/.test(navigator.userAgent)) {
      pts[0] += window.pageXOffset;
      pts[1] += window.pageYOffset;
    }
    while (node) {
       pts[0] -= node.offsetLeft - node.scrollLeft;
       pts[1] -= node.offsetTop - node.scrollTop;
       node = node.offsetParent;
    }
    return [ 2 * pts[0] / cw - 1, 1 - 2 * pts[1] / ch ];
  }

  function getMousePoint(pts){
    var x = pts[0], y = pts[1];
    var mesh = scene.getObjectByName('map');
    var projector = new THREE.Projector();
    var raycaster = projector.pickingRay(new THREE.Vector3(x, y, 0), camera);
    var	intersects = raycaster.intersectObject(mesh);
    if (intersects.length > 0){
      var point = intersects[0].point;
      point = mesh.worldToLocal(point);
      var face = intersects[0].face;
      var triangle2d = new THREE.Triangle(mesh.geometry.vertices[face.a], mesh.geometry.vertices[face.b], mesh.geometry.vertices[face.c]);
      var bary = triangle2d.barycoordFromPoint(point);
      var newPoint = vertexOnSphere[face.a].clone().multiplyScalar(bary.x).add(
                     vertexOnSphere[face.b].clone().multiplyScalar(bary.y)).add(
                     vertexOnSphere[face.c].clone().multiplyScalar(bary.z));
      var mat = rotationMatrix.clone().transpose();
      return newPoint.normalize().applyMatrix4(mat);
    }
  }

  // EVENTS

  function mousedown(ev){
    var pts = canvasXY(ev);
    startPoint = getMousePoint(pts);
  }

  function mouseup(ev){
    startPoint = false;
  }

  function mousemove(ev){
    if (startPoint) {
      ev.preventDefault();
      var pts = canvasXY(ev);
      var finalPoint = getMousePoint(pts);
      if (finalPoint) {
        var axis = new THREE.Vector3();
        axis.crossVectors( startPoint, finalPoint );
        axis.normalize();
        var angle = Math.acos(startPoint.dot(finalPoint));
        var rotMatrix = new THREE.Matrix4();
        rotMatrix.makeRotationAxis(axis, angle);
        rotate(rotMatrix);
        render();
      }
    }
  }

  function mousewheel(ev){
    var delta = Math.max(-1, Math.min(1, (ev.wheelDelta || -ev.detail)));
    rotateXY( 5 * delta, 0 );
    render();
  }

  var dw = new THREE.WebGLRenderer();

  dw.setClearColor( 0xcccccc );

  dw.domElement.addEventListener('mousedown', mousedown, false);
  dw.domElement.addEventListener('mousemove', mousemove, false);
  dw.domElement.addEventListener('mouseup', mouseup, false);
  dw.domElement.addEventListener('mousewheel', mousewheel, false);
  dw.domElement.addEventListener('DOMMouseScroll', mousewheel, false); // firefox

  // canvas 2d
  var canvas = new dbCarta({width:1000, height:500, rbar: false});
  canvas.extend(canvas.mopt, mopt);

  var layerTexture = new THREE.Texture(canvas);
  var rotationMatrix = new THREE.Matrix4();

  var camera = new THREE.OrthographicCamera( -1, 1,1,-1, 0, 1000);
  camera.position.z = 1000;

  var scene = new THREE.Scene();

  var startPoint;

  // html controls

  var mtab = document.createElement('table');
  mtab.style.borderCollapse = 'collapse';
  var row = document.createElement('tr');
  row.style.height = '1px';
  row.style.backgroundColor = '#d2e0f0';
  mtab.appendChild(row);

  var col = document.createElement('td');
  col.width = '15%';
  col.style.whiteSpace = 'nowrap';
  var el = document.createElement('h2');
  el.appendChild(document.createTextNode('Атлас 3d'));
  el.style.padding = '0';
  el.style.margin = '0';
  col.appendChild(el);
  row.appendChild(col);

  var col = document.createElement('td');
  col.width = '25%';
  var layerlist = el = document.createElement('select');
  el.id = 'layerlist';
  col.appendChild(el);
  var satlist = el = document.createElement('select');
  el.id = 'satlist';
  col.appendChild(el);
  var projlist = el = document.createElement('select');
  el.id = 'projlist';
  col.appendChild(el);
  row.appendChild(col);

  var col = document.createElement('td');
  col.width = '10%';
  var yy = el = document.createElement('select');
  yy.id = 'yy';
  col.appendChild(el);
  var mm = el = document.createElement('select');
  mm.id = 'mm';
  col.appendChild(el);
  var dd = el = document.createElement('select');
  dd.id = 'dd';
  col.appendChild(el);
  row.appendChild(col);

  var col = document.createElement('td');
  col.width = '9%';
  var hh = el = document.createElement('select');
  hh.id = 'hh';
  col.appendChild(el);
  var mi = el = document.createElement('select');
  mi.id = 'mi';
  col.appendChild(el);
  var ss = el = document.createElement('select');
  ss.id = 'ss';
  col.appendChild(el);
  row.appendChild(col);

  var col = document.createElement('td');
  col.width = '1%';
  el = document.createElement('button');
  el.id = 'btauto';
  col.appendChild(el);
  el.onclick = setAutoTime;
  el.title = 'Обновлять по таймеру';
  el.appendChild(document.createTextNode('▶'));
  col.appendChild(el);
  row.appendChild(col);

  var col = document.createElement('td');
  col.width = '10%';
  col.align = 'center';
  var el = document.createElement('div');
  el.id = 'tcoord';
  el.style.fontSize = 'smaller';
  col.appendChild(el);
  row.appendChild(col);

  var row = document.createElement('tr');
  var mcol = document.createElement('td');
  mcol.colSpan = '50';
  mcol.style.padding = '0';
  row.appendChild(mcol);
  mtab.appendChild(row);
  document.body.appendChild(mtab);

  // add select entry
  var optfunc = function(o, k, v) {
    var el = document.createElement('option');
    el.value = k;
    el.appendChild(document.createTextNode(v || k));
    o.appendChild(el);
  };

  // list layers
  optfunc(layerlist, 'Слои...');
  layerlist.options[layerlist.selectedIndex].disabled = 'true';
  for(var i in mopt) optfunc(layerlist, i);

  layerlist.onchange = function() {
    var name = this.value;
    mopt[name]['hide'] = (!mopt[name]['hide']);
    this.options[this.selectedIndex].style.color = (mopt[name]['hide'] ? 'lightgray' : '');
    this.selectedIndex = 0;
    update();
  };

  // list sat
  optfunc(satlist, 'Аппараты...');
  satlist.options[satlist.selectedIndex].disabled = 'true';
  for(var i in TLEDATA.GLONASS) optfunc(satlist, TLEDATA.GLONASS[i][0]);

  satlist.onchange = function() {
    msat[this.value] = (!msat[this.value]);
    this.options[this.selectedIndex].style.color = (msat[this.value] ? 'lightgray' : '');
    this.selectedIndex = 0;
    update();
  };
  // hide some sat
  for(var i=0; i<satlist.options.length; i++) {
    if (i>1) {
      satlist.options[i].style.color = 'lightgray';
      msat[satlist.options[i].value] = true;
    }
  };

  // list proj
  optfunc(projlist, 'Проекции...');
  projlist.options[projlist.selectedIndex].disabled = 'true';
  optfunc(projlist, 'buildEquirectangular()', 'Equirectangular');
  optfunc(projlist, 'buildCassini()', 'Cassini');
  optfunc(projlist, 'buildLambert()', 'Lambert cylindrical');
  optfunc(projlist, 'buildBehrmann()', 'Behrmann');
  optfunc(projlist, 'buildHoboDyer()', 'Hobo-Dyer');
  optfunc(projlist, 'buildGallStereo()', 'Gall Stereo');
  optfunc(projlist, 'buildGallPeters()', 'Gall-Peters');
  optfunc(projlist, 'buildMercator()', 'Mercator');
  optfunc(projlist, 'buildMiller()', 'Miller');
  optfunc(projlist, 'buildOcta()', 'Octamap');
  optfunc(projlist, 'buildOrthographic()', 'Ortho');
  optfunc(projlist, 'buildStereographic()', 'Stereo');
  optfunc(projlist, 'buildGrinten()', 'Grinden');
  optfunc(projlist, 'buildMollweide()', 'Mollweide');
  optfunc(projlist, 'buildAitoff()', 'Aitoff');
  optfunc(projlist, 'buildHammer()', 'Hammer');
  optfunc(projlist, 'buildKavraiskiy()', 'Kavraisky');
  optfunc(projlist, 'buildCubeMap()', 'Cube');
  optfunc(projlist, 'buildCollignon()', 'Collignon');
  optfunc(projlist, 'buildHEALPix()', 'HEALPix');
  optfunc(projlist, 'buildLambertConic()', 'Conformal Conic');
//  optfunc(projlist, 'buildAlbersConic()', 'Albers Conic');
  optfunc(projlist, 'buildAzimuthal()', 'Azimuthal');
  optfunc(projlist, 'buildLambertAzimuthal()', 'Lambert azimuthal');
  optfunc(projlist, 'buildButterfly()', 'Butterfly');
  optfunc(projlist, 'buildDymaxion()', 'Dymaxion');

  projlist.onchange = function() {
    rotationMatrix.identity();
    eval(this.value);
    init();
  };

  // fill date/time
  for(i=1999; i<2050; i++) optfunc(yy, i);
  for(i=1; i<13; i++) optfunc(mm, i);
  for(i=1; i<32; i++) optfunc(dd, i);
  for(i=0; i<24; i++) optfunc(hh, i);
  for(i=0; i<60; i++) optfunc(mi, i);
  for(i=0; i<60; i++) optfunc(ss, i);

  yy.onchange = function() { update(); };
  mm.onchange = function() { update(); };
  dd.onchange = function() { update(); };
  hh.onchange = function() { update(); };
  mi.onchange = function() { update(); };
  ss.onchange = function() { update(); };

  // events
  mcol.appendChild(dw.domElement);
  resize();
  buildStereographic();
  setSelTime();
  init();
  setAutoTime();

}