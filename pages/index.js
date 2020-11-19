import { MdTune } from 'react-icons/md';
import { GiMetronome } from 'react-icons/gi'
import { AiFillPauseCircle, AiFillPlayCircle } from 'react-icons/ai'
import { useState, useRef } from 'react'

export default function Home() {
  let paused = true
  const beep = useRef(null)
  const [tune, setTune] = useState("")
  const [metronome, setMetronome] = useState("active")
  const [bpm, setBpm] = useState(100)
  const [chords, setChords] = useState([
    {
      chord: "E",
      status: "",
      ref: useRef(null)
    },
    {
      chord: "A",
      status: "",
      ref: useRef(null)
    },
    {
      chord: "D",
      status: "",
      ref: useRef(null)
    },
    {
      chord: "G",
      status: "",
      ref: useRef(null)
    },
    {
      chord: "B",
      status: "",
      ref: useRef(null)
    },
    {
      chord: "e",
      status: "",
      ref: useRef(null)
    },
  ])

  const interval = setInterval(() => {
    if (!paused) {
      beep.current.play()
    }
  }, 1 / bpm * 60 * 1000)

  const pause = () => paused = true
  const resume = () => paused = false

  const tuneClick = () => {
    if (tune) {
      setTune("")
    }
    else {
      setTune("active")
      setMetronome("")
    }
  }

  const metronomeClick = () => {
    if (metronome) {
      setMetronome("")
    }
    else {
      setMetronome("active")
      setTune("")
      setChords(chords.map(value => ({ chord: value.chord, status: "", ref: value.ref })))
      chordStopAll()
    }
  }

  const chordStopAll = () => {
    chords.forEach(value => {
      console.log(value)
      value.ref.current.pause();
      value.ref.current.currentTime = 0;
    })
  }

  const chordClick = (key) => {
    setChords(chords.map((value, index) => {
      if (index === key) {
        if (value.status === "chordActive") {
          chordStopAll()
          return {
            chord: value.chord,
            status: "",
            ref: value.ref
          }
        }

        chordStopAll()
        value.ref.current.play()
        value.ref.current.loop = true

        return {
          chord: value.chord,
          status: "chordActive",
          ref: value.ref
        }
      }
      else {
        return {
          chord: value.chord,
          status: "",
          ref: value.ref
        }
      }
    }))
  }

  const rangeChange = (e) => {
    clearInterval(interval)
    setBpm(e.target.value)
  }

  return (
    <div className="container">
      {chords.map(value => {
        return <audio ref={value.ref} key={value.chord} src={`${value.chord}.mp3`} />
      })}
      <audio ref={beep} src="/beep.mp3" />
      <div className="tab">
        <MdTune className={`itens ${tune}`} onClick={tuneClick} />
        <GiMetronome className={`itens ${metronome}`} onClick={metronomeClick} />
      </div>

      {tune ? (
        <div className="chordContainer">
          <h1>Select a Chord</h1>
          {chords.map((value, index) =>
            (
              <p
                key={index}
                className={`chord ${value.status}`}
                onClick={() => chordClick(index)}>
                {value.chord}
              </p>
            )
          )
          }
        </div>
      ) : (
          <div className="metronomeContainer">
            <h1>{bpm} BPM</h1>
            <input type="range" value={bpm} step="0" min="40" max="300" onChange={(e) => rangeChange(e)} />
            <div>
              <AiFillPlayCircle className="svg" onClick={resume} />
              <AiFillPauseCircle className="svg" onClick={pause} />
            </div>
          </div>
        )
      }
    </div >
  )
}
