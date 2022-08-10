
import * as THREE from 'three';
import { FlakesTexture } from 'three/examples/jsm/textures/FlakesTexture.js';

import imgBloomBrake from '../assets/images/bloom-brake.png';
import imgBloomRed from '../assets/images/bloom_red.png';
import imgBloomOrange from '../assets/images/bloom_orange.png';
import imgBloomBlue from '../assets/images/bloom_blue.png';
import imgBloomRingBlue from '../assets/images/bloom_ring_blue.png';
import imgBloomBlueSim from '../assets/images/bloom_blue_sim.png';
import imgBloomVerRed from '../assets/images/bloom_ver_red.png';
import imgBloomVerBlue from '../assets/images/bloom_ver_blue.png';
import imgBloomVerOrange from '../assets/images/bloom_ver_orange.png';
import imgBloomCircleBlue from '../assets/images/bloom_circle_blue.png';
import imgBloomCircleOrange from '../assets/images/bloom_circle_orange.png';
import imgBloomLight from '../assets/images/bloom_light.png';
import imgLogoArrow from '../assets/images/trans/logo-arrow.png';

import imgPanoBack from '../assets/images/pano-back.jpg';
import imgPanoRound from '../assets/images/pano-corner.png';
import imgPanoBottom from '../assets/images/pano-bottom.png';
import imgPanoRoundNight from '../assets/images/pano-corner-night.png';
import imgPanoBottomNight from '../assets/images/pano-bottom-night.png';
import imgNight2 from '../assets/images/night_2.jpg';

import imgEnvPX from '../assets/images/px.png';
import imgEnvPY from '../assets/images/py.png';
import imgEnvPZ from '../assets/images/pz.png';
import imgEnvNX from '../assets/images/nx.png';
import imgEnvNY from '../assets/images/ny.png';
import imgEnvNZ from '../assets/images/nz.png';

import imgLeatherNormal from '../assets/images/leather_normal_0.jpg';

const imgEnv0Arr = [imgEnvPX, imgEnvNX, imgEnvPY, imgEnvNY, imgEnvPZ, imgEnvNZ];

export const modelH = 4, serverUrl = 'https://rungra888.com/emogonRD/', apiUrl =  serverUrl + 'admin/';

export function SetLogoCustom(logoCustom, logoMesh, arrowArr) {
	if (!logoMesh) return;
	const {l, w, t, h} = logoCustom;
	logoMesh.position.x = l; logoMesh.scale.x = w;
	logoMesh.position.y = t; logoMesh.scale.y = h;
	const {posT, posB, posL, posR} = GetArrowPos(logoCustom);
	arrowArr.forEach(arrow => {
		if 		(arrow.name === 'logo_arrow_tl') {arrow.position.x = posL; arrow.position.y = posT;}
		else if (arrow.name === 'logo_arrow_tr') {arrow.position.x = posR; arrow.position.y = posT;}
		else if (arrow.name === 'logo_arrow_bl') {arrow.position.x = posL; arrow.position.y = posB;}
		else if (arrow.name === 'logo_arrow_br') {arrow.position.x = posR; arrow.position.y = posB;}
	});
}

export function GetArrowPos(logoCustom) {
	const {l, w, t, h} = logoCustom, posT = t + h/20, posB = t - h/20, posL = l - w/20, posR = l + w/20;
	return {posT, posB, posL, posR};
}

export function GetNextArrowPos (selArrowName, arrowSPos, nextPosX, nextPosY) {
	const {posT, posB, posL, posR} = arrowSPos;
	var nextT = posT, nextB = posB, nextL = posL, nextR = posR;
	if (selArrowName==='logo_arrow_tl') {
		if (nextPosX > posR - 0.1 || nextPosY < posB + 0.1) {}
		else {nextL = nextPosX; nextT = nextPosY; }
	} else if (selArrowName==='logo_arrow_tr') {
		if (nextPosX < posL + 0.1 || nextPosY < posB + 0.1) {}
		else {nextR = nextPosX; nextT = nextPosY; }
	} else if (selArrowName==='logo_arrow_bl') {
		if (nextPosX > posR - 0.1 || nextPosY > posT - 0.1) {}
		else {nextL = nextPosX; nextB = nextPosY; }
	} else if (selArrowName==='logo_arrow_br') {
		if (nextPosX < posL + 0.1 || nextPosY > posT - 0.1) {}
		else {nextR = nextPosX; nextB = nextPosY; }
	}
	return {posT:nextT, posB:nextB, posL:nextL, posR:nextR};
}

export function GetNextLogoValue(nextArrowPos) {
	const {posT, posB, posL, posR} = nextArrowPos;
	const w = (posR - posL)*10, h = (posT - posB)*10, l = (posR+posL)/2, t = (posT+posB)/2;
	return {l, w, t, h};
}

export function SetLogoImg(logoImg, logoMesh) {
	logoMesh.visible = logoImg?true:false;
	if (!logoImg) return;
	const oldExt = logoImg.split('.').pop(), realExt = (oldExt==='png' || oldExt==='jpg' || oldExt==='jpeg')?'':'.png';
	const logoFileName = window.location.hostname==="localhost"?'test.png':logoImg+realExt;
	logoMesh.material.map = GetMap('./logo/'+logoFileName);
	logoMesh.material.needsUpdate = true;
}

export function SetColor(bodyMeshArr, selCol) {
	bodyMeshArr.forEach(child => { child.material.color.setHex(selCol); });
}

export function GetClickObj(e, arr, camera, wSize, mouse, raycaster) {
	var posX, posY;
	if (e.clientX && e.clientY) {posX = e.clientX; posY = e.clientY;}
	else if (e.touches || e.changedTouches){
		const touch = e.touches[0] || e.changedTouches[0];
		posX = touch.pageX; posY = touch.pageY;
	} else return;
	mouse.x = ( posX / wSize.width ) * 2 - 1;
	mouse.y = - ( posY / wSize.height ) * 2 + 1;
	raycaster.setFromCamera( mouse, camera );
	const interObj = raycaster.intersectObjects( arr )[0];
	if (interObj) interObj.pos2D = {x:posX, y:posY};
	return interObj;
}

function GetMap(img) {
	const texture = new THREE.TextureLoader().load(img);
	// texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	// texture.offset.set( 0, 0 );
	// texture.repeat.set( 1, 1 );
	return texture;
}

function GetMat(img) {
	return new THREE.MeshBasicMaterial({map:GetMap(img), transparent:true, side:2});
}

export const panoMat = {sun:{back:GetMap(imgPanoBack),	round:GetMat(imgPanoRound), bottom:GetMat(imgPanoBottom) },
						moon:{back:GetMap(imgNight2), 	round:GetMat(imgPanoRoundNight), bottom:GetMat(imgPanoBottomNight)}}

export function CustomModel(object, self, gltf) {
	const envMap = new THREE.CubeTextureLoader().load(imgEnv0Arr);
	const normalMap3 = new THREE.CanvasTexture( new FlakesTexture() );
	normalMap3.wrapS = THREE.RepeatWrapping;
	normalMap3.wrapT = THREE.RepeatWrapping;
	normalMap3.repeat.x = 10;
	normalMap3.repeat.y = 6;
	normalMap3.anisotropy = 16;
	// const bodyMat = new THREE.MeshPhysicalMaterial({ clearcoat:0.9, envMap, reflectivity:0, roughness:0, metalness:0 })
	const bodyMat = new THREE.MeshPhysicalMaterial({ clearcoat:0.9, envMap, clearcoatRoughness: 0.4, metalness: 0.5, roughness: 0.5, color: 0x00ff00, normalMap: normalMap3, normalScale: new THREE.Vector2( 0.15, 0.15 ) } );
	// const glodMat = new THREE.MeshPhysicalMaterial({ clearcoat:0.9, envMap, clearcoatRoughness: 0.4, metalness: 0.5, roughness: 0.5, color: 0x00ff00, normalMap: normalMap3, normalScale: new THREE.Vector2( 0.15, 0.15 ) } );
	const mapBloomBrake = GetMap(imgBloomBrake),
		mapBloomRed = GetMap(imgBloomRed),
		mapBloomBlue = GetMap(imgBloomBlue),
		mapBloomOrange = GetMap(imgBloomOrange),
		mapBloomRingBlue = GetMap(imgBloomRingBlue),
		mapBloomBlueSim = GetMap(imgBloomBlueSim),
		mapBloomVerRed = GetMap(imgBloomVerRed),
		mapBloomVerBlue = GetMap(imgBloomVerBlue),
		mapBloomVerOrange = GetMap(imgBloomVerOrange),
		mapBloomCircleBlue = GetMap(imgBloomCircleBlue),
		mapBloomCircleOrange = GetMap(imgBloomCircleOrange),
		mapBloomLight = GetMap(imgBloomLight),
		mapLogoArrow = GetMap(imgLogoArrow),
		mapLeatherNormal = GetMap(imgLeatherNormal),
		simGreyMat = new THREE.MeshPhongMaterial({envMap, color:0x767979, reflectivity:0.6}); // 909898, 0.8 ;
		// mapBloomBlue.wrapS = mapBloomBlue.wrapT = THREE.RepeatWrapping;
	self.goldMat = bodyMat.clone(); self.goldMat.reflectivity = 1; self.goldMat.color.setHex(0x605D3C);
	object.traverse(child => {
		if (child.name.includes('body')) { child.material = bodyMat; self.bodyMeshArr.push(child); }
		if (child.name.includes('PLATTFORM')) self.bottomArr.push(child);
		if (child.name.includes('back')) {child.oriBackPos = Math.round(child.position.x * 1000)/1000; self.backArr.push(child);}
		if (child.name.includes('box')) self.boxArr.push(child);
		if (child.name.includes('box_back')) self.rearArr.push(child);
		if (child.name.includes('ceiling')) self.ceilingArr.push(child);
		if (child.name.includes('box_side')) self.sideMeshArr.push(child);
		if (child.name.includes('proto_')) {self.protoModelArr.push(child); }
		else if (child.name.includes('proSim_rear_')) {self.simRearModelArr.push(child); }
		else if (child.name.includes('proSim_BLOOM_blue')) {self.headlight0BloomArr.push(child);}
		else if (child.name==='proSim_headlight1') {self.headlight1 = child; }
		else if (child.name==='proSim_headlight2') {self.headlight2 = child; }
		else if (child.name==='proSim_strap') {self.proSimStrap = child; child.visible = false;}
		// if (child.name === 'Rear_back') self.rearGroup = child;
		else if (child.name === 'PEDAL') self.pedal = child;
		else if (child.name === 'Brake') self.brakeGroup = child;
		else if (child.name.includes('Wheel')) self.wheelArr.push(child);
		else if (child.name.includes('wheel_canoo')) self.wheelCanooArr.push(child);
		else if (child.name.includes('frontMain')) self.frontArr.push(child);
		else if (child.name.includes('frame_RAHMEN')) self.frameArr.push(child);
		else if (child.name.includes('fender')) self.fenderArr.push(child);
		else if (child.name==='easyTwo_eppBox') self.eppBox = child;
		else if (child.name==='easyTwo_passenger') self.passenger = child;
		else if (child.name==='back_brake') self.backBrake = child;
		else if (child.name==='frame_pickUp_blackTube') self.framePickUp = child;
		else if (child.name==='handle') {child.oriPos={...child.position}; self.handle = child;}
		else if (child.name==='regular_chair') self.chairRegular = child; 
		else if (child.name==='space_chair') self.chairSpace = child;
		else if (child.name==='SITZBOX') {self.chairBox = child; child.material = new THREE.MeshStandardMaterial({color:0xBDBDBD});}
		else if (child.name==='SITZ') {child.oriBackPos = {...child.position}; self.sitzModel = child;}
		else if (child.name==='protoDash_canoo') self.protoDashCanoo = child;
		else if (child.name==='protoDash_preme') self.protoDashPreme = child;
		else if (child.name==='sim_front_light_emissive') self.simplexGoldLight = child;
		if (child instanceof THREE.Mesh) {
			if (child.material.length) {
				child.material.forEach(mat => { mat.side = 2; });
			} else  {child.material.side = 2; child.castShadow = true;}
		}
		if (child.name.includes('logo')) {
			child.castShadow = false; child.visible = false; child.material = new THREE.MeshBasicMaterial({transparent:true, color:0xFFFFFF});
			if (child.name==='logo_plane') {self.logoMesh = child;}
			else if (child.name.includes('logo_arrow')) {child.material.map = mapLogoArrow; child.material.opacity = 0.7; self.logoArrowArr.push(child);}
		} else if (child.name === 'FRONT_BLACK') {
			child.material = new THREE.MeshPhysicalMaterial({ clearcoat:0.9, color:0x000000, envMap, reflectivity: 1});
			// child.material = new THREE.MeshStandardMaterial({envMap, reflectivity:0.9, color:0x151515, metalness:0.4, roughness:0.6});
		} else if (child.name.includes('glass')) {
			var color = 0xEEEEEE, opacity = 0.4;
			if (child.name.includes('glassDark')) {color = 0x555555; opacity = 0.8}
			child.material = new THREE.MeshPhongMaterial({envMap, transparent:true, opacity, color, reflectivity:1});
			if (child.name.includes('glassLight')) self.glassLightArr.push(child);
		} else if (child.name==='sim_front_black') {
			child.material = new THREE.MeshPhysicalMaterial({ color:0x333333, envMap, reflectivity: 1, roughness:0.5, metalness:1, side:2});
		} else if (child.name==='mirror_plane') {
			child.material = new THREE.MeshPhongMaterial({envMap, color:0xFFFFFF, emissive:0xFFFFFF, shininess:100, reflectivity:1});
		} else if (child.name==='sim_middle_grey') { // simLeder_yellow
			if (gltf) child.children[0].material = simGreyMat; else child.material[0] = simGreyMat;
		} else if (child.name==='simLeader_grey') {
			child.material = simGreyMat;
		} else if (child.name==='simLeder_yellow') {
			child.material = new THREE.MeshPhongMaterial({color:0xFF8D33, roughness:0.9, metalness:0.1, shininess:80, envMap, reflectivity:0.2, normalMap:mapLeatherNormal, normalScale:new THREE.Vector2(1, 3)});
		} else if (child.name.includes('blackTube')) {
			child.material = new THREE.MeshStandardMaterial({envMap, color:0x222222, roughness:0.4, metalness:1, side:2});
		} else if (child.name.includes('emissive')) {
			child.oriCol = child.material.color.getHex(); self.lightMeshArr.push(child);
		} else if (child.name==='PRIME_LACK') { 
			child.material = new THREE.MeshPhongMaterial({envMap, reflectivity:0.3, color:0x586A74, side:2});
		} else if (child.name.includes('BLOOM')) {
			self.bloomArr.push(child);
			child.material = new THREE.MeshBasicMaterial({transparent:true});
			if (child.name.includes('proSim_BLOOM_blue')) {child.material.map = mapBloomBlueSim; }
			else if (child.name.includes('BLOOM_red')) {child.material.map = mapBloomRed;}
			else if (child.name.includes('BLOOM_blue')) {child.material.map = mapBloomBlue; }
			else if (child.name.includes('BLOOM_center')) child.material.map = mapBloomBrake;
			else if (child.name.includes('BLOOM_orange')) child.material.map = mapBloomOrange;
			else if (child.name.includes('BLOOM_ver_red')) {child.material.map = mapBloomVerRed;}
			else if (child.name.includes('BLOOM_ver_blue')) {child.material.map = mapBloomVerBlue; }
			else if (child.name.includes('BLOOM_ver_orange')) {child.material.map = mapBloomVerOrange; }
			else if (child.name.includes('BLOOM_circle_blue')) {child.material.map = mapBloomCircleBlue; }
			else if (child.name.includes('BLOOM_ring_blue')) {child.material.map = mapBloomRingBlue; }
			else if (child.name.includes('BLOOM_circle_orange')) {child.material.map = mapBloomCircleOrange; }
			else if (child.name.includes('light_BLOOM')) {
				if 		(child.name.includes('left')) child.camDir = 2.35;
				else if (child.name.includes('right')) child.camDir = 0.79;
				else if (child.name.includes('middle')) child.camDir = 1.57;
				child.material.map = mapBloomLight;
				child.material.depthTest = false;
				self.lightBloomArr.push(child);
			}
		} else if (child.name.includes('golden')) {
			child.material = self.goldMat;
		}
		['front', 'dashboard', 'Brake'].forEach(simName => {
			if (child.name===simName) self.simOtherArr.push(child);
		});
	})
	const vPos = new THREE.Box3().setFromObject(object), vSize = vPos.getSize(new THREE.Vector3()), scl = modelH/vSize.y;
	object.scale.set(scl, scl, scl);
	return object;
}

export function HEXStrToHexInt(rrggbb) {
	var bbggrr = rrggbb.substr(4, 2) + rrggbb.substr(2, 2) + rrggbb.substr(0, 2);
	return parseInt(bbggrr, 16);
}

export function getTouchPos(e) {
	var pos = {x:0, y:0};
	if (e.touches || e.changedTouches){
		const touch = e.touches[0] || e.changedTouches[0];
		pos = {x:touch.pageX, y:touch.pageY};
	}
	return pos;
}

export function GetLangLabel(item, lan, type) {
	if (!item) return '';
	else if (lan==='en') {
		if (type==='small') return item.description;
		else return item.label;
	} else if (lan==='de') {
		if (type==='small') return item.description_de;
		else return item.label_de;
	} else return '';
}
