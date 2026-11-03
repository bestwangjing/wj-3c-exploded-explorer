import * as THREE from './vendor/three.module.js';

export const categories = [
  {id:'shell',name:'机身与密封',en:'HOUSING & SEALING',color:'#a5bfc5',material:'铝合金 / 弹性体',desc:'外框承载内部结构，密封圈与接口盖形成连续的防护边界。',offset:[0,.3,2.5]},
  {id:'optics',name:'光学镜组',en:'OPTICAL ASSEMBLY',color:'#9aeac8',material:'光学玻璃 / 阳极氧化铝',desc:'镜片、间隔环与遮光结构共同形成光路；逐层展开观察光线进入传感器前的路径。',offset:[.35,.45,5.2]},
  {id:'sensor',name:'影像传感',en:'IMAGING SENSOR',color:'#b1a6ee',material:'硅 / 陶瓷 / 光学玻璃',desc:'滤光片与传感器将光学图像转换为电信号，支架和垫片用于保持光轴位置。',offset:[.3,.1,1.3]},
  {id:'board',name:'主板与计算',en:'MAINBOARD & COMPUTE',color:'#71cda9',material:'FR-4 / 铜 / 半导体',desc:'主板连接处理器、存储、电源管理与各种接口。铜走线、芯片封装和贴片器件均可近距离观察。',offset:[0,0,-.6]},
  {id:'thermal',name:'散热与屏蔽',en:'THERMAL & SHIELDING',color:'#e8bd8e',material:'铜 / 石墨 / 导热硅胶',desc:'导热界面将热量传向均热板，金属屏蔽罩隔开相邻电子区域。',offset:[0,.1,-2.5]},
  {id:'power',name:'电池与供电',en:'BATTERY & POWER',color:'#e2d38c',material:'电芯 / 铝塑膜 / 聚酰亚胺',desc:'电池、保护板与连接触点组成可拆卸电源模块。这里展示的是结构示意。',offset:[-4.3,-.2,.3]},
  {id:'display',name:'显示与交互',en:'DISPLAY & INTERACTION',color:'#82bce6',material:'玻璃 / 显示层 / 柔性电路',desc:'前后显示模组由盖板、触控层、显示层、支撑框与排线构成。',offset:[-.1,.1,-4.8]},
  {id:'hardware',name:'紧固与连接',en:'FASTENERS & CONNECTIONS',color:'#98aab5',material:'不锈钢 / 铜合金 / 工程塑料',desc:'螺丝、支柱、连接器和声学器件共同完成机械固定与电气连接。',offset:[0,0,.1]},
];

export function createModel() {
  const root=new THREE.Group(),parts=[],byId=new Map();
  const mats={
    shell:()=>new THREE.MeshStandardMaterial({color:0x34444b,metalness:.78,roughness:.32}),
    dark:()=>new THREE.MeshStandardMaterial({color:0x17252b,metalness:.6,roughness:.35}),
    rubber:()=>new THREE.MeshStandardMaterial({color:0x10191d,metalness:.06,roughness:.92}),
    metal:()=>new THREE.MeshStandardMaterial({color:0x9daeb2,metalness:.85,roughness:.28}),
    copper:()=>new THREE.MeshStandardMaterial({color:0xc9996c,metalness:.85,roughness:.28}),
    gold:()=>new THREE.MeshStandardMaterial({color:0xdcc27e,metalness:.8,roughness:.25}),
    pcb:()=>new THREE.MeshStandardMaterial({color:0x15715a,metalness:.25,roughness:.48}),
    chip:()=>new THREE.MeshStandardMaterial({color:0x25313a,metalness:.45,roughness:.55}),
    ceramic:()=>new THREE.MeshStandardMaterial({color:0xb4b3aa,metalness:.1,roughness:.5}),
    glass:()=>new THREE.MeshPhysicalMaterial({color:0x5da6ae,metalness:.25,roughness:.08,transparent:true,opacity:.43,side:THREE.DoubleSide,depthWrite:false,clearcoat:1,iridescence:1}),
    sensor:()=>new THREE.MeshPhysicalMaterial({color:0x7766bf,metalness:.65,roughness:.19,clearcoat:1,iridescence:1}),
    flex:()=>new THREE.MeshStandardMaterial({color:0xd38e36,metalness:.35,roughness:.42,side:THREE.DoubleSide}),
    thermal:()=>new THREE.MeshStandardMaterial({color:0x97b4b8,metalness:.1,roughness:.95}),
    red:()=>new THREE.MeshStandardMaterial({color:0xd56655,metalness:.4,roughness:.35}),
  };
  function roundedPath(w,h,r=.12){const x=-w/2,y=-h/2,s=new THREE.Shape();s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s;}
  function plate(w,h,d,r=.12,holes=[]){const s=roundedPath(w,h,Math.min(r,w/3,h/3));for(const a of holes){let p;if(a.type==='circle'){p=new THREE.Path();p.absarc(a.x||0,a.y||0,a.r,0,Math.PI*2,true);}else{p=roundedPath(a.w,a.h,a.r||.08);p.translate=undefined;if(a.x||a.y){const pts=p.getPoints(20);p=new THREE.Path(pts.map(v=>new THREE.Vector2(v.x+(a.x||0),v.y+(a.y||0))));}}s.holes.push(p);}const g=new THREE.ExtrudeGeometry(s,{depth:d,bevelEnabled:false,curveSegments:10,steps:1});g.translate(0,0,-d/2);return g;}
  function ring(ro,ri,d){const s=new THREE.Shape();s.absarc(0,0,ro,0,Math.PI*2,false);const h=new THREE.Path();h.absarc(0,0,ri,0,Math.PI*2,true);s.holes.push(h);const g=new THREE.ExtrudeGeometry(s,{depth:d,bevelEnabled:false,curveSegments:40});g.translate(0,0,-d/2);return g;}
  function disk(r,d){const g=new THREE.CylinderGeometry(r,r,d,48);g.rotateX(Math.PI/2);return g;}
  function edge(mesh,opacity=.27){const e=new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry,35),new THREE.LineBasicMaterial({color:0xa7cfc5,transparent:true,opacity}));mesh.add(e);e.userData.edge=true;return e;}
  function add(cat,name,en,geo,material,pos,detail=[0,0,0],extra={}){const c=categories.find(c=>c.id===cat);const index=parts.filter(p=>p.cat===cat).length+1;const id=`${String(categories.indexOf(c)+1).padStart(2,'0')}-${String(index).padStart(2,'0')}`;const mesh=new THREE.Mesh(geo,mats[material]());mesh.castShadow=true;mesh.receiveShadow=true;const group=new THREE.Group();group.add(mesh);group.position.fromArray(pos);root.add(group);if(material!=='glass'&&material!=='rubber')edge(mesh);const p={id,name,en,cat,group,mesh,home:new THREE.Vector3(...pos),spread:new THREE.Vector3(...c.offset),detail:new THREE.Vector3(...detail),material:extra.material||c.material,desc:extra.desc||c.desc,role:extra.role||'结构组成',size:extra.size||'概念比例',...extra};parts.push(p);byId.set(id,p);group.userData.partId=id;return p;}
  function box(cat,name,en,w,h,d,mat,pos,detail,extra={}){return add(cat,name,en,plate(w,h,d,Math.min(.1,w*.12,h*.12)),mat,pos,detail,extra);}
  function addChild(p,geo,mat,pos=[0,0,0]){const m=new THREE.Mesh(geo,typeof mat==='string'?mats[mat]():mat);m.position.fromArray(pos);p.group.add(m);return m;}
  function decal(p,text,w,h,pos,color='#b9cecb',bg='#223035'){const cv=document.createElement('canvas');cv.width=512;cv.height=256;const ctx=cv.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,512,256);ctx.fillStyle=color;ctx.font='bold 60px monospace';ctx.textAlign='center';ctx.fillText(text,256,130);ctx.font='22px monospace';ctx.fillText('A–01 / ENGINEERING CONCEPT',256,181);const tx=new THREE.CanvasTexture(cv);tx.colorSpace=THREE.SRGBColorSpace;return addChild(p,new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map:tx,roughness:.55,metalness:.1}),pos);}
  // The housing is an actual hollow frame, leaving the internal assembly visible.
  add('shell','一体承力中框','Unibody chassis',plate(6.2,4.15,1.85,.35,[{w:5.74,h:3.69,r:.2}]),'shell',[0,0,0],[0,.2,0],{role:'承载与定位',size:'62 × 41.5 × 18.5 mm（示意）',desc:'中框为中空结构；前后开口容纳光学、电路与显示组件。它为所有内部零件提供统一的定位基准。'});
  const front=add('shell','前部结构面板','Front structural faceplate',plate(6.18,4.13,.17,.34,[{type:'circle',x:1.26,y:.32,r:1.32},{w:2.15,h:1.7,x:-1.52,y:.24,r:.13}]),'shell',[0,0,1.01],[0,0,1.25],{role:'前部保护与开孔',desc:'双开口面板分别为镜头与前置显示模组让出空间；边缘倒角与装配边界独立建模。'});
  decal(front,'A–01',1.15,.34,[-1.5,-1.45,.093],'#adc5c4','#34444b');
  const seal=add('shell','前面板周向密封圈','Front perimeter gasket',plate(5.95,3.92,.045,.29,[{w:5.77,h:3.74,r:.23}]),'rubber',[0,0,.9],[0,0,.68],{role:'接缝密封'});
  add('shell','后部显示承载框','Rear display frame',plate(6.15,4.1,.15,.32,[{w:5.52,h:3.35,r:.18}]),'shell',[0,0,-1.04],[0,0,-1.1],{spread:new THREE.Vector3(0,0,-4.8),role:'后屏固定'});
  add('shell','后盖环形密封圈','Rear sealing gasket',plate(5.96,3.91,.05,.28,[{w:5.73,h:3.67,r:.2}]),'rubber',[0,0,-.93],[0,0,-.55],{spread:new THREE.Vector3(0,0,-4.8),role:'后盖防护'});
  box('shell','顶部防滑橡胶','Top elastomer grip',5.0,.09,1.36,'rubber',[-.35,2.1,0],[0,1.15,0],{spread:new THREE.Vector3(0,1.6,0)});
  box('shell','快门按钮底座','Shutter button base',1.05,.12,.75,'dark',[1.65,2.15,.15],[0,1.6,0],{spread:new THREE.Vector3(0,1.6,0),role:'快门行程支撑'});
  const shutter=add('shell','快门按键帽','Shutter cap',disk(.34,.1),'red',[1.65,2.24,.15],[0,2.12,0],{spread:new THREE.Vector3(0,1.6,0),role:'快门交互'});shutter.mesh.rotation.x=Math.PI/2;
  box('shell','侧面功能按键','Mode key',.1,.7,.55,'rubber',[-3.14,.83,0],[-.8,.4,0],{spread:new THREE.Vector3(-1.2,0,0)});
  box('shell','USB 接口防护盖','USB door',.13,1.12,.86,'shell',[3.14,.7,0],[1.5,.3,0],{spread:new THREE.Vector3(1.5,0,0)});
  box('shell','接口盖弹性垫','Port gasket',.06,.95,.7,'rubber',[3.05,.7,0],[.8,.3,0],{spread:new THREE.Vector3(1.5,0,0)});
  box('shell','电池仓盖','Battery door',2.35,.15,1.55,'shell',[-1.48,-2.12,0],[-.8,-1,0],{spread:new THREE.Vector3(-2.8,-1.3,0)});
  box('shell','底部快拆连接座','Quick release base',2.0,.24,1.25,'dark',[.72,-2.18,0],[0,-1.4,0],{spread:new THREE.Vector3(0,-1.25,0)});
  for(let i=0;i<2;i++)box('shell',`磁吸定位块 ${i+1}`,'Alignment magnet',.38,.12,.53,'metal',[.2+i,-2.32,0],[i*.65-.3,-1.95,0],{spread:new THREE.Vector3(0,-1.25,0),material:'钕磁体 / 防护镀层'});
  for(let i=0;i<9;i++){const rib=addChild(parts[5],new THREE.BoxGeometry(.09,.035,1.18),'dark',[-2+i*.45,.055,0]);}
  // Multi-element optical train, each lens and spacer is an independently selectable part.
  const lx=1.26,ly=.32;
  const barrel=add('optics','镜头外筒','Lens barrel',ring(1.26,1.04,.62),'dark',[lx,ly,1.35],[0,0,-.45],{role:'光学组件定位',size:'外径 25.2 mm（示意）'});
  for(let i=0;i<36;i++){const a=i/36*Math.PI*2;const r=addChild(barrel,new THREE.BoxGeometry(.035,.09,.38),'shell',[Math.cos(a)*1.26,Math.sin(a)*1.26,0]);r.rotation.z=a-Math.PI/2;}
  add('optics','镜头保护圈','Protective bezel',ring(1.33,1.15,.14),'shell',[lx,ly,1.75],[0,0,3.35],{role:'保护镜固定'});
  add('optics','保护镜密封圈','Lens seal',ring(1.18,1.11,.045),'rubber',[lx,ly,1.68],[0,0,2.95]);
  add('optics','前保护玻璃','Cover glass',disk(1.135,.07),'glass',[lx,ly,1.7],[0,0,2.6],{material:'光学玻璃',role:'外部光学防护',desc:'最外侧透明保护层。与成像镜片分开建模，展开后可以观察保护玻璃、密封圈与固定环的关系。'});
  for(let i=0;i<6;i++){
    const radius=.94-i*.075;const pts=[];for(let j=0;j<=20;j++){const r=radius*j/20;pts.push(new THREE.Vector2(r,.035+Math.sqrt(Math.max(0,1-(r/radius)**2))*.065));}for(let j=20;j>=0;j--){const r=radius*j/20;pts.push(new THREE.Vector2(r,-.035-Math.sqrt(Math.max(0,1-(r/radius)**2))*.045));}const geo=new THREE.LatheGeometry(pts,48);geo.rotateX(Math.PI/2);
    add('optics',`第 ${i+1} 组曲面镜片`,`Lens element L${i+1}`,geo,'glass',[lx,ly,1.56-i*.15],[0,0,2.12-i*.56],{material:'光学玻璃（示意）',role:'光路折射',desc:`独立曲面镜片 L${i+1}。模型展示多片镜组的空间关系，曲率与间距为视觉示意，不是可制造的光学处方。`});
    if(i<5)add('optics',`镜片间隔环 ${i+1}`,'Optical spacer',ring(radius+.055,radius-.065,.04),'dark',[lx,ly,1.49-i*.15],[0,0,1.87-i*.56],{role:'轴向间距定位'});
  }
  add('optics','固定孔径遮光环','Fixed aperture baffle',ring(.67,.35,.035),'dark',[lx,ly,.61],[0,0,-1.35],{role:'限制杂散光',desc:'固定孔径环用于展示遮光结构。此概念模型不假定运动相机具有可变光圈。'});
  add('optics','后端镜片压圈','Rear retaining ring',ring(.72,.57,.07),'metal',[lx,ly,.57],[0,0,-1.7],{role:'镜组轴向锁定'});
  // Imaging sensor package and the flexible interconnect.
  box('sensor','传感器安装基板','Sensor PCB',1.88,1.58,.08,'pcb',[lx,ly,.30],[0,0,-.55],{role:'传感器电路承载'});
  box('sensor','陶瓷封装基座','Ceramic package',1.34,1.06,.09,'ceramic',[lx,ly,.37],[0,0,-.18],{role:'芯片封装'});
  const sensor=box('sensor','CMOS 感光芯片','CMOS image sensor',1.05,.77,.045,'sensor',[lx,ly,.435],[0,0,.26],{material:'硅 / 微透镜阵列',role:'光电转换',desc:'光学图像在这里转为电信号。紫蓝色感光区域用规则纹理表现像素阵列，仅作结构示意，不对应真实像素数量。'});
  for(let i=0;i<28;i++){addChild(sensor,new THREE.BoxGeometry(.005,.72,.002),new THREE.MeshBasicMaterial({color:0xab87bc,transparent:true,opacity:.28}),[-.5+i*.037,0,.025]);}
  add('sensor','红外截止滤光片','IR-cut filter',plate(1.22,.94,.025,.02),'glass',[lx,ly,.49],[0,0,.72],{role:'光谱过滤',material:'镀膜光学玻璃'});
  add('sensor','传感器遮光框','Sensor light shield',plate(1.7,1.42,.07,.08,[{w:1.22,h:.94,r:.02}]),'dark',[lx,ly,.44],[0,0,1.14],{role:'遮光与定位'});
  for(let i=0;i<4;i++)add('sensor',`光轴调整垫片 ${i+1}`,'Alignment shim',ring(.12,.055,.025),'copper',[lx+(i%2?-.77:.77),ly+(i<2?-.59:.59),.35],[(i%2?-.35:.35),(i<2?-.35:.35),-.26],{role:'模组定位补偿'});
  const sensorFlex=box('sensor','传感器 FPC 排线','Sensor flex cable',.42,1.05,.035,'flex',[lx,-.73,.25],[.1,-.6,-.4],{role:'影像信号传输'});for(let i=0;i<8;i++)addChild(sensorFlex,new THREE.BoxGeometry(.018,.95,.005),'gold',[-.16+i*.045,0,.022]);
  box('sensor','传感器排线连接器','Sensor FPC connector',.62,.18,.13,'ceramic',[lx,-1.25,.12],[.1,-.95,-.4],{role:'排线压接'});
  // Mainboard, routed copper traces, ICs, passives and plated contacts.
  const pcb=box('board','六层主电路板','Main logic PCB',5.35,3.3,.11,'pcb',[0,0,-.23],[0,0,0],{role:'电路互联',size:'53.5 × 33 mm（示意）',desc:'主板承载处理、存储、通信与电源管理电路。铜走线和焊盘用于呈现结构层次，不代表可生产的电路设计。'});
  for(let i=0;i<31;i++){const x=-2.5+(i%11)*.47,y=-1.45+Math.floor(i/11)*1.05;const points=[new THREE.Vector3(x,y,.065),new THREE.Vector3(x+.18,y,.065),new THREE.Vector3(x+.39,y+.21,.065),new THREE.Vector3(x+.39,y+.55,.065)];pcb.group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:i%4===0?0xe3bc69:0x6ca484,transparent:true,opacity:.65})));}
  for(let i=0;i<20;i++)addChild(pcb,disk(.032,.007),'gold',[-2.38+(i%10)*.52,-1.43+Math.floor(i/10)*2.85,.063]);
  const chips=[['影像处理器 SoC','Image processor',.95,.95,-.15,.45,'视觉计算核心'],['运行内存 DRAM','DRAM memory',.7,.54,-1.13,.6,'数据缓存'],['闪存控制芯片','Flash controller',.62,.55,-1.13,-.38,'存储控制'],['电源管理芯片 PMIC','Power management',.55,.55,.85,-.73,'电源调度'],['无线通信模组','Wireless module',.8,.6,1.9,.9,'无线通信'],['惯性测量单元 IMU','Inertial measurement unit',.32,.32,1.85,-.53,'姿态检测'],['音频编解码器','Audio codec',.38,.38,-1.95,-.85,'音频信号处理'],['接口控制器','Interface controller',.4,.4,.95,1.12,'接口管理']];
  chips.forEach((c,i)=>{const p=box('board',c[0],c[1],c[2],c[3],.12,'chip',[c[4],c[5],-.10],[(c[4]>.5?.23:c[4]<-.5?-.23:0),c[5]>.2?.2:-.2,.5+(i%3)*.24],{material:'半导体 / 环氧封装',role:c[6],desc:`${c[0]}位于主板表面，负责${c[6]}。封装与位置按概念设计建模，没有使用特定产品的内部电路数据。`});decal(p,i===0?'VISION':i===1?'DRAM':c[1].split(' ')[0].toUpperCase(),c[2]*.88,c[3]*.78,[0,0,.062],'#bdc9c6','#25313a');for(let j=0;j<8;j++){addChild(p,new THREE.BoxGeometry(.035,.05,.02),'metal',[-c[2]/2+.06+j*(c[2]-.12)/7,-c[3]/2-.025,.015]);addChild(p,new THREE.BoxGeometry(.035,.05,.02),'metal',[-c[2]/2+.06+j*(c[2]-.12)/7,c[3]/2+.025,.015]);}});
  for(let i=0;i<16;i++){const x=-2.25+(i%8)*.6,y=i<8?-1.24:1.3;const p=box('board',`去耦电容 C${String(i+1).padStart(2,'0')}`,'Decoupling capacitor',.17,.09,.09,'ceramic',[x,y,-.11],[0,(i<8?-.3:.3),.38+(i%3)*.17],{material:'陶瓷 / 金属端电极',role:'局部电源滤波'});for(const s of [-1,1])addChild(p,new THREE.BoxGeometry(.035,.095,.095),'metal',[s*.07,0,0]);}
  for(let i=0;i<12;i++){const x=-2.26+(i%6)*.36,y=i<6?-.03:-.8;const p=box('board',`贴片电阻 R${String(i+1).padStart(2,'0')}`,'SMD resistor',.13,.065,.055,'dark',[x,y,-.13],[-.12,-.1,.36+(i%3)*.16],{material:'厚膜电阻 / 陶瓷',role:'电路信号调理'});for(const s of [-1,1])addChild(p,new THREE.BoxGeometry(.025,.068,.058),'metal',[s*.054,0,0]);}
  for(let i=0;i<3;i++)box('board',`电源电感 L${i+1}`,'Power inductor',.29,.27,.19,'dark',[.45+i*.49,-1.25,-.08],[.1,-.36,.48],{role:'电源能量储存',material:'铁氧体 / 铜绕组'});
  box('board','时钟晶体振荡器','Crystal oscillator',.43,.24,.12,'metal',[.88,.38,-.10],[.24,.15,.48],{role:'时钟参考'});
  // Heat spreader, shielding, thermal interfaces and mounting bosses.
  const heat=box('thermal','铜质均热板','Copper heat spreader',4.86,2.92,.09,'copper',[0,0,-.55],[0,0,-.3],{material:'铜',role:'热量扩散',desc:'铜质板件将局部热源向更大面积扩散。展开可以看到它与导热垫、屏蔽罩及机身的相对位置。'});
  for(let i=0;i<8;i++)addChild(heat,new THREE.BoxGeometry(4.25,.013,.005),new THREE.MeshStandardMaterial({color:0x7e4c32,metalness:.7,roughness:.4}),[0,-1.1+i*.3,.047]);
  box('thermal','石墨导热膜','Graphite thermal sheet',4.7,2.78,.018,'rubber',[0,0,-.62],[0,0,-.85],{role:'面内热扩散',material:'石墨复合薄膜'});
  box('thermal','处理器导热垫','Processor thermal pad',1.1,1.1,.055,'thermal',[-.15,.45,-.38],[0,0,.7],{role:'填充导热接触间隙'});
  box('thermal','内存导热垫','Memory thermal pad',.8,.66,.055,'thermal',[-1.13,.6,-.38],[-.2,.15,.65],{role:'接触导热'});
  const shield=box('thermal','主板电磁屏蔽罩','Main EMI shield',2.15,1.53,.035,'metal',[-.55,.35,.04],[0,.25,1.3],{role:'电磁屏蔽',material:'镀镍金属薄板'});
  for(let i=0;i<12;i++)addChild(shield,disk(.035,.005),'dark',[-.9+(i%6)*.36,-.52+Math.floor(i/6)*1.04,.022]);
  box('thermal','射频屏蔽盖','RF shield cover',.93,.75,.035,'metal',[1.9,.9,.04],[.3,.3,.9],{role:'无线模组屏蔽'});
  for(let i=0;i<4;i++)box('thermal',`机身导热接触块 ${i+1}`,'Chassis thermal bridge',.3,.5,.12,'thermal',[i%2?2.48:-2.48,i<2?.9:-.9,-.54],[i%2?.4:-.4,i<2?.15:-.15,-.12],{role:'板件与中框导热连接'});
  // Power assembly stays lateral to the optical and mainboard stack.
  const battery=box('power','锂离子电芯','Lithium-ion cell',2.02,2.65,.62,'metal',[-1.62,-.12,.36],[-.7,0,0],{role:'储存能量',material:'锂离子软包电芯',desc:'铝塑膜包覆的独立电芯。容量与电压不作真实产品声明；可继续查看外壳、保护板、触点与排线。'});
  decal(battery,'POWER',1.7,1.1,[0,0,.314],'#b6e5ca','#1d3830');
  const holder=add('power','电池定位托架','Battery cradle',plate(2.27,2.91,.12,.12,[{w:1.91,h:2.55,r:.1}]),'dark',[-1.62,-.12,.02],[-.7,0,-.85],{role:'电芯固定'});
  box('power','电芯绝缘膜','Cell insulating film',2.04,2.68,.018,'rubber',[-1.62,-.12,.70],[-.7,0,.6],{role:'电气绝缘',material:'聚酯绝缘膜'});
  const bms=box('power','电池保护板','Battery protection PCB',1.85,.29,.07,'pcb',[-1.62,1.4,.35],[-.7,.6,0],{role:'电芯保护电路'});
  box('power','保护电路芯片','Protection IC',.32,.18,.08,'chip',[-1.85,1.42,.43],[-.8,1.05,.4],{role:'监测与保护'});
  box('power','电池温度检测元件','Cell thermistor',.1,.12,.06,'chip',[-1.25,1.4,.42],[-.4,1.05,.4],{role:'温度检测'});
  for(let i=0;i<4;i++)box('power',`电池触点 ${i+1}`,'Battery terminal',.18,.29,.08,'gold',[-2.18+i*.36,-1.65,.37],[-.7,-.5,i%2*.2],{role:'可拆电气连接'});
  box('power','电源柔性排线','Power flex cable',.35,.7,.03,'flex',[-.45,-.9,.2],[.1,-.4,.3],{role:'供电连接'});
  box('power','电池弹性缓冲垫','Battery cushion',1.85,2.45,.04,'rubber',[-1.62,-.12,-.03],[-.7,0,-1.3],{role:'防止电芯松动'});
  // Display stack, with a procedural screen image and individually separable layers.
  function displayTexture(front=false){const c=document.createElement('canvas');c.width=768;c.height=480;const x=c.getContext('2d');let g=x.createLinearGradient(0,0,0,480);g.addColorStop(0,'#243e51');g.addColorStop(.6,'#478c8c');g.addColorStop(1,'#143e3d');x.fillStyle=g;x.fillRect(0,0,768,480);x.fillStyle='#b3daca';x.beginPath();x.moveTo(0,330);x.lineTo(230,100);x.lineTo(330,235);x.lineTo(450,148);x.lineTo(768,360);x.fill();x.fillStyle='#305659';x.beginPath();x.moveTo(0,390);x.lineTo(230,150);x.lineTo(290,285);x.lineTo(460,210);x.lineTo(768,405);x.fill();x.fillStyle='#102e33';x.beginPath();x.moveTo(0,360);x.lineTo(170,300);x.lineTo(400,430);x.lineTo(620,300);x.lineTo(768,350);x.lineTo(768,480);x.lineTo(0,480);x.fill();x.fillStyle='#f69e7d';x.beginPath();x.arc(42,40,8,0,Math.PI*2);x.fill();x.fillStyle='#e8fff4';x.font='22px monospace';x.fillText('00:12:48',65,48);x.fillText('4K / 60',620,48);x.font='17px monospace';x.fillText('A–01   EXPLORE MORE',28,451);x.strokeStyle='#cee9ddaa';x.lineWidth=2;x.strokeRect(340,195,90,90);x.beginPath();x.moveTo(372,240);x.lineTo(398,240);x.moveTo(385,227);x.lineTo(385,253);x.stroke();const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;}
  const rearBase=box('display','后屏金属背板','Rear display backplate',5.48,3.25,.07,'metal',[0,0,-1.03],[0,0,.6],{role:'显示模组承载'});
  box('display','后屏显示层','Rear display panel',5.32,3.1,.055,'dark',[0,0,-1.1],[0,0,0],{role:'图像显示'});
  const rearScreen=box('display','后屏触控层','Rear touch digitizer',5.31,3.09,.025,'glass',[0,0,-1.15],[0,0,-.6],{role:'触摸交互',material:'透明导电层 / 玻璃'});
  const rearGlass=box('display','后屏盖板玻璃','Rear cover glass',5.53,3.32,.055,'glass',[0,0,-1.2],[0,0,-1.25],{role:'显示模组表面保护',material:'盖板玻璃'});
  const rearPic=addChild(parts.find(p=>p.name==='后屏显示层'),new THREE.PlaneGeometry(5.24,3.02),new THREE.MeshBasicMaterial({map:displayTexture(),side:THREE.DoubleSide}),[0,0,-.031]);rearPic.rotation.y=Math.PI;
  add('display','后屏粘接密封框','Rear screen adhesive',plate(5.56,3.35,.02,.12,[{w:5.31,h:3.1,r:.08}]),'rubber',[0,0,-1.08],[0,0,.3],{role:'周向粘接与密封'});
  const frontDisplay=box('display','前置取景屏','Front viewfinder display',2.06,1.61,.065,'dark',[-1.52,.24,1.08],[0,0,.65],{spread:new THREE.Vector3(-.6,.3,3.1),role:'前置画面与状态显示'});
  addChild(frontDisplay,new THREE.PlaneGeometry(1.96,1.49),new THREE.MeshBasicMaterial({map:displayTexture(true)}),[0,0,.035]);
  box('display','前屏保护玻璃','Front display glass',2.16,1.7,.04,'glass',[-1.52,.24,1.14],[0,0,1.3],{spread:new THREE.Vector3(-.6,.3,3.1),role:'前置显示保护'});
  box('display','前屏支撑底座','Front display bracket',2.18,1.74,.08,'metal',[-1.52,.24,.96],[0,0,0],{spread:new THREE.Vector3(-.6,.3,3.1),role:'前屏机械支撑'});
  box('display','后屏柔性排线','Rear display flex',.6,1.18,.03,'flex',[1.92,-.8,-.9],[1.1,-.5,-.5],{role:'显示信号传输'});
  box('display','前屏柔性排线','Front display flex',.4,.92,.025,'flex',[-1.51,-.93,.8],[0,-.5,.3],{spread:new THREE.Vector3(-.6,.3,3.1),role:'前屏信号连接'});
  box('display','显示驱动芯片','Display driver IC',.6,.2,.08,'chip',[.1,-1.42,-1.02],[0,-.5,.3],{role:'面板驱动'});
  // Visible hardware. Heads include a physical cross slot and shaft.
  function screw(x,y,z,i,front=true){const p=add('hardware',`${front?'前':'后'}面板固定螺丝 ${i+1}`,'Chassis screw',disk(.1,.065),'metal',[x,y,z],[x*.25,y*.2,front?1.1:-1.1],{spread:new THREE.Vector3(0,0,front?2.5:-4.8),material:'不锈钢',role:'板件固定'});addChild(p,disk(.046,.28),'metal',[0,0,front?-.16:.16]);const slotMat=new THREE.MeshBasicMaterial({color:0x1a262a});addChild(p,new THREE.BoxGeometry(.11,.023,.006),slotMat,[0,0,front?.036:-.036]);addChild(p,new THREE.BoxGeometry(.023,.11,.006),slotMat,[0,0,front?.036:-.036]);}
  const screwCoords=[[-2.86,-1.78],[2.86,-1.78],[-2.86,1.78],[2.86,1.78],[-.65,-1.87],[.65,1.87]];screwCoords.forEach(([x,y],i)=>screw(x,y,1.12,i,true));screwCoords.forEach(([x,y],i)=>screw(x,y,-1.16,i,false));
  for(let i=0;i<4;i++)add('hardware',`主板金属支柱 ${i+1}`,'Mainboard standoff',ring(.12,.05,.4),'gold',[i%2?-2.46:2.46,i<2?-1.4:1.4,-.46],[i%2?-.5:.5,i<2?-.4:.4,-.45],{role:'主板固定支撑'});
  const usb=add('hardware','USB-C 接口外壳','USB-C connector',plate(.4,.68,.42,.13,[{w:.25,h:.51,r:.09}]),'metal',[2.71,.67,-.1],[1.7,0,0],{role:'外部数据与供电接口'});usb.group.rotation.y=Math.PI/2;
  box('hardware','存储卡槽','Memory card socket',1.1,.85,.11,'metal',[1.93,-.71,-.38],[1.25,-.7,-.3],{role:'存储卡接入'});
  const card=box('hardware','可拆卸存储卡','Removable memory card',.94,.74,.045,'dark',[1.93,-.72,-.45],[1.6,-1.45,-.5],{role:'文件存储'});decal(card,'MEMORY',.83,.58,[0,0,.025]);
  for(let i=0;i<2;i++){const mic=add('hardware',`MEMS 麦克风 ${i+1}`,'MEMS microphone',disk(.14,.11),'metal',[i?2.6:-2.6,1.5,.15],[i?1:-1,.6,.2],{role:'声音采集'});addChild(mic,disk(.025,.005),'dark',[0,0,.059]);}
  const speaker=add('hardware','微型扬声器','Miniature speaker',disk(.35,.14),'dark',[2.4,-1.2,.17],[1.7,-1,.3],{role:'提示音输出'});addChild(speaker,ring(.3,.23,.01),'metal',[0,0,.076]);
  box('hardware','天线柔性线路','Flexible antenna',.2,2.4,.025,'flex',[2.88,.1,0],[1.5,.1,.7],{role:'无线信号耦合'});
  for(let i=0;i<3;i++){const c=box('hardware',`板端 FPC 连接座 ${i+1}`,'Board FPC connector',.66,.16,.13,'ceramic',[-1.3+i*1.25,-1.55,-.1],[0,-.6,.4],{role:'柔性电路连接'});for(let j=0;j<9;j++)addChild(c,new THREE.BoxGeometry(.026,.075,.018),'gold',[-.26+j*.065,0,.075]);}
  const led=box('hardware','状态指示灯','Status indicator',.09,.11,.07,'ceramic',[-2.7,1.4,1.07],[-.4,.3,1],{spread:new THREE.Vector3(0,.3,2.5),role:'工作状态提示'});led.mesh.material.emissive=new THREE.Color(0x7af7c0);led.mesh.material.emissiveIntensity=.9;
  // Snapshot materials for reversible highlighting, translucency and isolation.
  for(const p of parts)p.group.traverse(o=>{if(o.material){o.userData.base={color:o.material.color?.clone(),emissive:o.material.emissive?.clone(),emissiveIntensity:o.material.emissiveIntensity,opacity:o.material.opacity,transparent:o.material.transparent,depthWrite:o.material.depthWrite};}});
  return {root,parts,byId};
}
