import * as THREE from './vendor/three.module.js';
import {createBuilder} from './geometry-kit.js';
export const categories=[
 {id:'shell',name:'机箱与面板',en:'ENCLOSURE',color:'#a5bfc5',material:'钢 / 铝 / 玻璃（示意）',desc:'开放式框架、侧板和前面板构成概念机箱。',offset:[0,0,0],xray:true},
 {id:'board',name:'主板与处理器',en:'MAINBOARD',color:'#71cda9',material:'FR-4 / 半导体',desc:'处理器、芯片组、内存插槽和主板元件。布局用于结构展示。',offset:[0,0,1]},
 {id:'graphics',name:'图形与扩展',en:'GRAPHICS',color:'#b1a6ee',material:'FR-4 / 半导体 / 金属',desc:'显卡板、图形芯片、显存及散热器可分离观察。',offset:[.3,-.3,4.3]},
 {id:'memory',name:'内存与存储',en:'MEMORY & STORAGE',color:'#82bce6',material:'半导体 / PCB / 金属',desc:'独立内存模组与存储装置，未声明具体性能或容量。',offset:[3.2,.2,2]},
 {id:'thermal',name:'风扇与散热',en:'COOLING',color:'#e8bd8e',material:'铝 / 铜 / 塑料',desc:'处理器散热器与机箱风扇引导散热路径。',offset:[0,1.4,4]},
 {id:'power',name:'电源与线束',en:'POWER',color:'#e2d38c',material:'金属 / 铜 / 塑料',desc:'电源壳、内部概念组件与外部线束独立建模，不作电气维修指导。',offset:[-3,-1.3,1.7]},
 {id:'io',name:'接口与控制',en:'I/O',color:'#91cbbf',material:'金属 / 绝缘塑料',desc:'机箱接口、开关与连接器用于外部交互。',offset:[4,.4,.3]},
 {id:'hardware',name:'紧固与支架',en:'FASTENERS',color:'#98aab5',material:'不锈钢 / 铜合金',desc:'螺丝、支柱与支架连接框架与板卡。',offset:[-.3,0,1]},
];
export function createModel(){const b=createBuilder(categories);
 for(const x of [-4.4,4.4])for(const z of [-3.8,3.8])b.box('shell',`机箱立柱 ${x<0?'左':'右'}${z<0?'后':'前'}`,'Frame upright',.23,14,.23,'shell',[x,0,z],[x*.1,0,z*.1]);
 for(const y of [-7,7])for(const z of [-3.8,3.8])b.box('shell',`水平框梁 ${y<0?'下':'上'}${z<0?'后':'前'}`,'Frame rail',8.8,.23,.23,'shell',[0,y,z],[0,y*.1,z*.1]);
 for(const x of [-4.4,4.4])for(const y of [-7,7])b.box('shell',`纵向框梁 ${x<0?'左':'右'}${y<0?'下':'上'}`,'Depth rail',.23,.23,7.6,'shell',[x,y,0],[x*.1,y*.1,0]);
 b.box('shell','透明观察侧板','Glass side panel',8.6,13.8,.09,'glass',[0,0,3.95],[0,0,1.1],{spread:[0,0,7.8]});b.box('shell','机箱背板','Rear side panel',8.6,13.8,.12,'shell',[0,0,-3.95],[0,0,-1],{spread:[0,0,-3.3]});
 const front=b.box('shell','机箱前面板','Front panel',7.55,13.8,.12,'dark',[4.55,0,0],[1.2,0,0],{rotation:[0,Math.PI/2,0],spread:[4,0,0]});for(let i=0;i<18;i++)b.child(front,new THREE.BoxGeometry(6.8,.055,.01),'metal',[0,-5.5+i*.64,.066]);
 b.box('shell','顶部防尘网','Top dust filter',8.5,7.4,.04,'dark',[0,7.14,0],[0,1.2,0],{rotation:[-Math.PI/2,0,0],spread:[0,2,0]});
 const board=b.box('board','主板 PCB','Motherboard',7.7,9.9,.12,'pcb',[0,1.5,-2.95],[0,0,0]);b.circuit(board,7.7,9.9);b.add('board','处理器插座框','CPU socket',b.plate(2.1,2.1,.13,.08,[{w:1.65,h:1.65,r:.04}]),'dark',[-.7,3,-2.77],[0,0,.45]);const cpu=b.box('board','中央处理器','CPU package',1.6,1.6,.12,'metal',[-.7,3,-2.67],[0,0,1.1]);b.label(cpu,'CPU',1.4,1.3,[0,0,.065]);b.box('board','芯片组','Chipset',1,1,.13,'chip',[.6,-.4,-2.78],[0,0,.7]);
 for(let i=0;i<4;i++)b.box('board',`内存插槽 ${i+1}`,'DIMM slot',.2,4.1,.24,'dark',[1.8+i*.4,3,-2.7],[0,0,.35]);for(let i=0;i<3;i++)b.box('board',`扩展插槽 ${i+1}`,'Expansion slot',4.3,.18,.2,'dark',[-.55,-1.4-i*.8,-2.7],[0,0,.35]);
 b.passives('board',[-3.4,5.5,-2.8],16,2,.43);b.passives('board',[-3.4,-3.0,-2.8],12,1,.48);for(let i=0;i<6;i++)b.add('board',`滤波电容 ${i+1}`,'Power capacitor',b.disk(.14,.35),'metal',[-3,1.7+i*.49,-2.63],[0,0,.55]);
 const gpu=b.box('graphics','显卡主电路板','Graphics PCB',7.3,2.8,.1,'pcb',[0,-1.65,-1.6],[0,0,0]);b.circuit(gpu,7.3,2.8);const gchip=b.box('graphics','图形处理器','GPU package',1.3,1.3,.12,'chip',[0,-1.65,-1.48],[0,0,.7]);b.label(gchip,'GPU',1.1,1.05,[0,0,.065]);for(let i=0;i<8;i++)b.box('graphics',`显存封装 ${i+1}`,'VRAM package',.55,.55,.09,'chip',[-2.4+i%4*1.6,-2.65+Math.floor(i/4)*2,-1.48],[0,0,.4+i%2*.2]);
 const sink=b.box('graphics','显卡散热鳍片组','GPU heatsink',7.1,2.65,.55,'metal',[0,-1.65,-1.0],[0,0,1.25]);for(let i=0;i<28;i++)b.child(sink,new THREE.BoxGeometry(.045,2.55,.65),'dark',[-3.3+i*.245,0,.0]);for(let i=0;i<2;i++)b.fan('graphics',`显卡风扇 ${i+1}`,[i?1.8:-1.8,-1.65,-.62],1.14,[0,0,2.15]);b.box('graphics','显卡安装挡板','GPU bracket',.2,3.3,1.6,'metal',[-3.85,-1.65,-1.3],[-.6,0,.3]);
 for(let i=0;i<2;i++){const p=b.box('memory',`内存条电路板 ${i+1}`,'Memory PCB',.08,4.3,1.05,'pcb',[2.2+i*.8,3,-2.4],[i*.55,0,.4]);for(let j=0;j<4;j++)b.box('memory',`内存条 ${i+1} 存储芯片 ${j+1}`,'DRAM package',.09,.7,.73,'chip',[2.27+i*.8,1.55+j*.9,-2.4],[.4+i*.55,0,.4]);}
 const ssd=b.box('memory','SSD 电路板','SSD PCB',1.15,3.8,.08,'pcb',[-2.45,-.2,-2.7],[-.5,0,.5]);b.circuit(ssd,1.15,3.8);for(let i=0;i<3;i++)b.box('memory',`SSD 闪存芯片 ${i+1}`,'NAND package',.85,.78,.09,'chip',[-2.45,-1.35+i*1.05,-2.6],[-.5,0,1]);b.box('memory','独立存储盘外壳','Storage drive',2.8,4,.65,'metal',[2,-4.5,-.5],[.4,-.5,.5]);
 const cpuSink=b.box('thermal','处理器散热鳍片','CPU fin stack',2.8,3.2,1.4,'metal',[-.7,3,-1.7],[0,0,.4]);for(let i=0;i<20;i++)b.child(cpuSink,new THREE.BoxGeometry(2.75,.05,1.45),'dark',[0,-1.4+i*.15,0]);b.box('thermal','处理器接触底板','CPU cold plate',1.8,1.8,.08,'copper',[-.7,3,-2.53],[0,0,-.5]);b.fan('thermal','处理器散热风扇',[-.7,3,-.9],1.4,[0,0,1.4]);
 for(let i=0;i<2;i++)b.fan('thermal',`机箱前风扇 ${i+1}`,[3.8,i?3.7:-.4,0],1.65,[1.1,0,0],{rotation:[0,Math.PI/2,0],spread:[3.6,0,.6]});
 const psu=b.add('power','电源模块外壳','PSU enclosure',b.plate(5.9,2.9,3.1,.16,[{w:5.55,h:2.55,r:.08}]),'dark',[-.9,-5.45,-1.4],[0,0,0]);b.box('power','电源底板','PSU base',5.7,2.7,.1,'metal',[-.9,-5.45,-3],[0,0,-.7]);const pp=b.box('power','电源电路板','Power PCB',5.4,2.4,.09,'pcb',[-.9,-5.45,-2.65],[0,0,.35]);b.circuit(pp,5.4,2.4);b.box('power','变压器封装','Transformer',1.3,1.1,1,'dark',[-.9,-5.45,-1.9],[0,0,1]);for(let i=0;i<3;i++)b.add('power',`电源滤波电容 ${i+1}`,'Power capacitor',b.disk(.28,.8),'metal',[-2.65+i*.7,-5.3,-2],[0,0,1]);b.fan('power','电源散热风扇',[-.9,-5.45,.15],1.12,[0,0,1.7]);for(let i=0;i<4;i++){const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(0,0,0),new THREE.Vector3(.4,1,.2),new THREE.Vector3(1.5,2.5,.5)]);b.add('power',`电源线束 ${i+1}`,'Power harness',new THREE.TubeGeometry(curve,16,.07,6,false),'rubber',[1.5+i*.15,-5.2,-.5],[.2,.2,i*.15]);}
 for(let i=0;i<6;i++)b.box('io',`主板外部接口 ${i+1}`,'Rear I/O port',.5,.6,.6,'metal',[-3.8,1+i*.7,-2.5],[-.7,0,.5]);b.box('io','前面板接口板','Front I/O PCB',1.2,2,.08,'pcb',[3.8,5.8,1.5],[.8,0,.3]);b.add('io','电源按钮','Power button',b.disk(.22,.1),'metal',[3.9,6.5,1.5],[1.4,0,.3],{rotation:[0,Math.PI/2,0]});
 for(let i=0;i<20;i++)b.screw('hardware',`机箱固定螺丝 ${i+1}`,[i%2?4.38:-4.38,-6.5+Math.floor(i/2)*1.44,3.9],[i%2?.35:-.35,0,1]);
 return b.finish();}
