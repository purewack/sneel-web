import useResizeObserver from "@react-hook/resize-observer";
import { useRef, useState } from "react";
import * as Tone from 'tone'

export default function useOnResizeComponent(externalRef) {
  const sizeRef = useRef(null);
  const [rect, setRect] = useState({ width: 1, height: 1 });
  const ref = externalRef ? externalRef : sizeRef
  useResizeObserver(ref, (entry) => {
    const r = window.getComputedStyle(entry.target);
    const rr = { width: parseFloat(r.width), height: parseFloat(r.height) }
    //console.log(rr,entry.target)
    setRect(rr);
  });
  return [ref, rect];
}

export function getRandomFrom(array){
  const r = Math.trunc(Math.random()*array.length)
  return array[r % array.length]
}

export function getRandomFromWithAvoid(pool,avoid){
  if(!pool.length || !pool) throw new Error('Nothing to pick from')
  
  let note;
  let dupe;
  let _pool = [...pool]
  do{
    dupe = false
    note = getRandomFrom(_pool)
    for(let i=0; i<avoid.length; i++){
        if(avoid[i] === note) {
          dupe = true
          _pool = _pool.filter(p=>p!==note)
          break
        }
    }
    if(!dupe) return note
    if(_pool.length === 1) return _pool[0]
  }while(dupe)
  return note
}


export const isWithinLimits = (x, l,h) => x <= h && x >= l
export const limit = (m,l,h)=> Math.min(h, Math.max(l,m))
export const rand = (min,max) => min + Math.trunc(Math.random() * (max-min)) 
export const probability = (chance) => {
  if(chance === 1) return true
  else if(!chance) return false
  else {
    return Math.random() <= chance
  }
}
export const leadingZeros = (num, size)=>{
  var s = num+"";
  while (s.length < size) s = "0" + s;
  return s;
}


export function QuanTime(nowTime, meter = [4,4], gridAlignStart = undefined){
  const [atBeats, barBeats] = meter
  const units = nowTime.split(':')
  const nowBar = parseInt(units[0])
  const nowBeat = parseInt(units[1])

  const quantize = (unit,q)=>Math.trunc((unit + q)/q)*q;

  //if align is less than bar length
  if(atBeats < barBeats){
    const adv =  quantize(nowBeat,atBeats)
    const nextBeat = adv%barBeats
    const nextBar = nowBar + Math.trunc(adv/barBeats)
    return `${nextBar}:${nextBeat}:0`
  }
  else {
    //bar times, adhere to gridAlign
    const adv = atBeats/barBeats
    if(gridAlignStart !== undefined){
      return `${quantize(nowBar,adv) + gridAlignStart}:0:0`
    }
    return `${nowBar + adv}:0:0`
  }
}

export function respellPitch(note, target='sharp'){
  const sharpToFlat = {
    'C#': 'Db',
    'D#': 'Eb',
    'F#': 'Gb',
    'G#': 'Ab',
    'A#': 'Bb',
  }

  const flatToSharp = {
    'Db': 'C#',
    'Eb': 'D#',
    'Gb': 'F#',
    'Ab': 'G#',
    'Bb': 'A#',
  }

  const converter = target.includes('flat') ? sharpToFlat : flatToSharp

  const nn = note.slice(0,-1)
  const octave = note[note.length-1]
  if(nn.includes('#') && target.includes('sharp')) return note
  if(nn.includes('b') && target.includes('flat')) return note
  if(nn.includes('#') || nn.includes('b')) return converter[nn] + octave
  return note
}
export function respellPitches(array, target){
  return array.map(n => {
    return respellPitch(n,target)
  })
}

export function toMidiArray(notesArray){
  return notesArray.map(e => Tone.Frequency(e).toMidi())
}

export function toNotesArray(midiArray, sharps = true){
  const arr = midiArray.map(e => Tone.Midi(e).toNote())
  if(!sharps) return respellPitches(arr,'flat')
  else return arr
}

export function getMidi(note){return Tone.Frequency(note).toMidi()}
export function getNote(midi, target){
  if(target) return respellPitch(Tone.Midi(midi).toNote(),target)
  return Tone.Midi(midi).toNote()
}

export function noAccidentals(range){
  return range.filter(e=>(!(e.includes('#') || e.includes('b'))))
}