import * as THREE from './vendor/three.module.js';
import {createBuilder} from './geometry-kit.js';
export const categories=[
 {id:'shell',name:'机身与铰链',en:'CHASSIS',color:'#a5bfc5',material:'铝合金（示意）',desc:'上壳、底盖与铰链组成笔记本承力结构。',offset:[0,-.6,0],xray:true},
 {id:'display',name:'屏幕总成',en:'DISPLAY',color:'#82bce6',material:'显示层 / 玻璃 / 金属',desc:'屏幕总成独立于基座，沿屏幕法向逐层拆解。',offset:[0,1,-3.7]},
 {id:'keyboard',name:'键盘与触控',en:'INPUT',color:'#b1a6ee',material:'塑料 / 薄膜 / 玻璃',desc:'每颗键帽独立建模，触控板与键盘底板可分离。',offset:[0,3.9,0]},
 {id:'board',name:'主板与计算',en:'MAINBOARD',color:'#71cda9',material:'FR-4 / 半导体',desc:'处理器、内存、电源管理和主板元件展示概念电路布局。',offset:[0,1.4,0]},
 {id:'thermal',name:'风扇与散热',en:'COOLING',color:'#e8bd8e',material:'铜 / 铝 / 导热材料',desc:'风扇、热管、鳍片与导热垫构成散热链路。',offset:[0,2.9,-.6],xray:true},
 {id:'power',name:'电池与供电',en:'POWER',color:'#e2d38c',material:'电芯 / 铝塑膜',desc:'多电芯供电组件，容量和排布均为概念示意。',offset:[0,-1.5,3]},
 {id:'io',name:'存储与接口',en:'STORAGE & I/O',color:'#91cbbf',material:'半导体 / 金属 / 塑料',desc:'SSD、无线模组、接口与扬声器完成扩展连接。',offset:[2.8,1.1,.3]},
 {id:'hardware',name:'紧固与定位',en:'FASTENERS',color:'#98aab5',material:'不锈钢',desc:'螺丝与定位件固定各个装配层。',offset:[0,-1.1,0]},
];
export function createModel(){const b=createBuilder(categories),flat={rotation:[-Math.PI/2,0,0]};
 b.add('shell','基座承力中框','Base chassis',b.plate(16,10.4,.55,.4,[{w:15.45,h:9.85,r:.3}]),'shell',[0,0,0],[0,0,0],flat);
 b.box('shell','底部检修盖','Bottom cover',15.96,10.36,.13,'shell',[0,-.39,0],[0,-1.9,0],flat);
 b.add('shell','键盘掌托面板','Palmrest panel',b.plate(15.97,10.37,.13,.39,[{w:13.6,h:5.25,x:0,y:1.55,r:.13},{w:4.7,h:2.65,x:0,y:-3,r:.15}]),'shell',[0,.4,0],[0,1,0],flat);
 for(let i=0;i<2;i++){b.add('shell',`屏幕铰链 ${i+1}`,'Display hinge',b.disk(.27,1.5),'metal',[i?5.9:-5.9,.45,-4.85],[i?.5:-.5,0,-.65],{rotation:[0,Math.PI/2,0]});b.box('shell',`底部防滑脚垫 ${i+1}`,'Rubber foot',12.8,.23,.09,'rubber',[0,-.5,i?4.3:-4.3],[0,-2.4,0],flat);}
 const screenRot=[-.12,0,0],screenLayers=[['屏幕后壳','Display back',.14,-5.44,-1.3,'shell'],['屏幕支撑层','Display support',.06,-5.29,-.65,'metal'],['显示面板','Display panel',.045,-5.2,0,'dark'],['显示盖板','Display glass',.035,-5.11,.65,'glass']];
 screenLayers.forEach(([n,en,d,z,ex,m],i)=>{const p=b.box('display',n,en,15.9,9.8,d,m,[0,5.35,z],[0,0,ex],{rotation:screenRot});if(i===2)b.screen(p,15.35,9.25,[0,0,.025]);});b.box('display','屏幕驱动电路','Display driver',8,.3,.08,'pcb',[0,.72,-5.12],[0,-.5,.5]);b.box('display','屏幕信号排线','Display cable',.45,2,.03,'flex',[-5.4,1.1,-4.9],[-.6,0,.5],{rotation:screenRot});b.add('display','前置摄像头','Webcam',b.disk(.12,.09),'dark',[0,9.82,-5.76],[0,.4,.5]);
 const keyplate=b.box('keyboard','键盘定位板','Keyboard plate',13.55,5.23,.1,'metal',[0,.35,-1.55],[0,-.35,0],flat);b.box('keyboard','键盘薄膜电路','Keyboard membrane',13.4,5.1,.025,'dark',[0,.27,-1.55],[0,-.8,0],flat);
 const rows=[['Esc','F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12','Del'],['`','1','2','3','4','5','6','7','8','9','0','-','=','⌫'],['Tab','Q','W','E','R','T','Y','U','I','O','P','[',']','\\'],['Caps','A','S','D','F','G','H','J','K','L',';','\'','Enter'],['Shift','Z','X','C','V','B','N','M',',','.','/','↑','Shift']];
 rows.forEach((row,r)=>row.forEach((key,col)=>{const p=b.box('keyboard',`键帽 ${key}`,'Keycap',.83,.78,.09,'dark',[-6.1+col*.94,.58,-3.64+r*.89],[0,.2+r*.08,0],flat);b.label(p,key,.72,.64,[0,0,.05],'#d4e5df','#1c2931');}));
 for(const [key,x,w] of [['Ctrl',-5.9,1.05],['Fn',-4.65,.8],['Alt',-3.55,.9],['Space',-.4,4.9],['AltR',2.65,.9],['←',4.05,.83],['↓',5.0,.83],['→',5.95,.83]]){const p=b.box('keyboard',`键帽 ${key}`,'Keycap',w,.72,.09,'dark',[x,.58,.84],[0,.6,0],flat);b.label(p,key,w*.85,.62,[0,0,.05]);}
 b.box('keyboard','触控板盖板','Trackpad glass',4.6,2.55,.06,'dark',[0,.5,3],[0,.7,.2],flat);b.box('keyboard','触控板感应电路','Trackpad PCB',4.5,2.45,.05,'pcb',[0,.38,3],[0,-.2,.2],flat);b.box('keyboard','键盘连接排线','Keyboard flex',.7,2.2,.025,'flex',[2,.2,1.5],[0,-.55,.5],flat);
 const pcb=b.box('board','主逻辑电路板','Main logic board',14,5.6,.12,'pcb',[0,-.05,-1.75],[0,0,0],flat);b.circuit(pcb,14,5.6);
 const chips=[['中央处理器','CPU',1.3,1.3,0,-2.1],['图形处理器','GPU',1.2,1.2,2.3,-2.1],['内存封装 A','DRAM A',1.15,.7,-2,-2.5],['内存封装 B','DRAM B',1.15,.7,-2,-1.4],['电源管理芯片','PMIC',.7,.7,1,-.8],['嵌入式控制器','EC',.7,.7,-4,-.6],['接口控制器','I/O',.55,.55,4.5,-.9]];
 chips.forEach(([n,en,w,h,x,z],i)=>{const p=b.box('board',n,en,w,h,.11,'chip',[x,.07,z],[0,.55+i%3*.18,0],flat);b.label(p,en,w*.85,h*.75,[0,0,.06]);});
 for(let i=0;i<40;i++){const p=b.box('board',`${i%2?'贴片电阻 R':'贴片电容 C'}${i+1}`,'SMD passive',.17,.09,.07,i%2?'dark':'ceramic',[-6.3+(i%20)*.64,.065,-4.16+Math.floor(i/20)*4.35],[0,.35+i%3*.12,0],flat);for(const s of [-1,1])b.child(p,new THREE.BoxGeometry(.03,.092,.075),'metal',[s*.07,0,0]);}
 for(let i=0;i<2;i++){const x=i?5.35:-5.35;b.fan('thermal',`散热风扇转子 ${i+1}`,[x,.16,-2.9],1.25,[0,.75,0],flat);b.add('thermal',`风扇罩 ${i+1}`,'Fan shroud',b.ring(1.36,1.2,.25),'dark',[x,.22,-2.9],[0,1.3,0],flat);const sink=b.box('thermal',`散热鳍片组 ${i+1}`,'Fin stack',2.5,.67,.36,'metal',[x,.16,-4.5],[0,.4,-.7],flat);for(let j=0;j<20;j++)b.child(sink,new THREE.BoxGeometry(.035,.66,.5),'dark',[-1.15+j*.12,0,0]);}
 for(let i=0;i<3;i++){const pts=[new THREE.Vector3(-5.4,0,-3.8+i*.2),new THREE.Vector3(-2,0,-3.1+i*.3),new THREE.Vector3(1,0,-2.1+i*.3),new THREE.Vector3(5.4,0,-3.7+i*.2)];b.add('thermal',`铜质热管 ${i+1}`,'Copper heat pipe',new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),40,.085,8,false),'copper',[0,.28,0],[0,1.2+i*.4,0]);}
 for(let i=0;i<2;i++){b.box('thermal',`${i?'GPU':'CPU'}导热接触板`,'Cold plate',1.55,1.55,.09,'copper',[i?2.3:0,.2,-2.1],[0,.5,0],flat);b.box('thermal',`${i?'GPU':'CPU'}导热垫`,'Thermal pad',1.35,1.35,.035,'thermal',[i?2.3:0,.15,-2.1],[0,.2,0],flat);}
 for(let i=0;i<4;i++){const p=b.box('power',`锂离子电芯 ${i+1}`,'Battery cell',2.7,3.15,.3,'metal',[-4.65+i*3.1,-.1,2.6],[(i-1.5)*.35,0,.25],flat);b.label(p,'CELL '+(i+1),2.3,2.6,[0,0,.16]);}b.box('power','电池管理板','Battery management',11,.45,.08,'pcb',[0,-.05,.72],[0,.6,-.5],flat);b.box('power','电池保护芯片','Protection IC',.5,.25,.08,'chip',[0,.04,.72],[0,1,-.5],flat);b.box('power','电池绝缘底垫','Battery insulation',12.2,3.5,.025,'rubber',[0,-.28,2.6],[0,-.65,0],flat);
 const ssd=b.box('io','固态硬盘电路板','SSD PCB',1.15,3.7,.09,'pcb',[3.5,.07,-1.0],[1,.3,.2],flat);b.circuit(ssd,1.15,3.7);for(let i=0;i<3;i++)b.box('io',`SSD 闪存封装 ${i+1}`,'NAND package',.85,.75,.07,'chip',[3.5,.17,-2.1+i*.95],[1,.8,.2],flat);b.box('io','无线网络模组','Wireless module',1.1,1.3,.1,'metal',[-3.6,.08,-2.4],[-.5,.4,0],flat);
 for(let i=0;i<4;i++)b.box('io',`侧边接口 ${i+1}`,'External port',.4,.65,.33,'metal',[i%2?7.75:-7.75,.05,-2.8+Math.floor(i/2)*2.0],[i%2?.8:-.8,.2,0],flat);for(let i=0;i<2;i++)b.box('io',`扬声器单元 ${i+1}`,'Speaker',1,3,.32,'dark',[i?6.9:-6.9,-.04,2.5],[i?.7:-.7,.1,.3],flat);
 for(let i=0;i<18;i++)b.screw('hardware',`底盖固定螺丝 ${i+1}`,[i%2?7.6:-7.6,-.5,-4.7+Math.floor(i/2)*1.15],[i%2?.3:-.3,-1.8,0],flat);
 return b.finish();}
