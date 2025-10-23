import Layout from "./components/layouts/Layout";
import Welcome from "./components/layouts/Welcome";
import Dashboard from "./components/layouts/Dashboard";
import Challenge from "./components/layouts/Challenge";
import WORDS from "./utils/VOCAB.json";
import { countdownIn24Hours, getWordByIndex, PLAN } from "./utils"
import { useEffect, useState } from "react";



function App() {
  const [ selectedPage, setSelectedPage ] = useState(0);
  // const selectedPage = 2;
  const [ name, setName ] = useState('');
  const [ day, setDay ] = useState(1)
  const [ datetime, setDatetime] = useState(null)
  const [ history, setHistory ] = useState({})
  const [ attempts, setAttempts ] = useState(0)

  const daysWords = PLAN[day].map((idx) => {
    return getWordByIndex(WORDS, idx).word
  })
  

  function handleChangePage(pageIndex) {
    setSelectedPage(pageIndex)
  }

  function handleCreateAccount() {
    if (!name) { return }
    localStorage.setItem('username', name)
    handleChangePage(1)
  }

  function handleCompleteDay() {
    const newDay = day + 1
    const newDatetime = Date.now()
    setDay(newDay)
    setDatetime(newDatetime)

    localStorage.setItem('day', JSON.stringify({
      day: newDay,
      datetime: newDatetime
    }))
    setSelectedPage(1)
  }

  function handleIncrementAttempts() {
    const newRecord = attempts + 1
    localStorage.setItem('attempts' ,newRecord)
    setAttempts(newRecord)
  }

  useEffect(() => {
    if (!localStorage) { return }
    
    if (localStorage.getItem('username')) {
      setName(localStorage.getItem('username'));
      setSelectedPage(1);
    }
    
    if (localStorage.getItem('attempts')) {
      setAttempts(parseInt(localStorage.getItem('attempts')))
    }

    if (localStorage.getItem('history')) {
      setHistory(JSON.parse(localStorage.getItem('history')))
    }

    if (localStorage.getItem('day')) {
      const { day: d, datetime:dt } =JSON.parse(localStorage.getItem('day'))
      setDatetime(dt)
      setDay(d)

      if (d > 1 && dt) {
        const diff = countdownIn24Hours(dt) 
        if (diff < 0) {
          console.log('Failed challenge')
          let newHistory = { ...history }
          const timestamp = new Date(dt)
          const formattedTimestamp = timestamp.toString().split(' ').splice(1, 4).join(' ')

          newHistory[formattedTimestamp] = d
          setHistory(newHistory)
          setDay(1)
          setDatetime(null)
          setAttempts(0)

          localStorage.getItem('attempts', 0)
          localStorage.getItem('history', JSON.stringify(newHistory))
          localStorage.getItem('day', JSON.stringify({
            day: 1,
            datetime: null
          }))
        }
      }
    }

  }, [])

  const pages = {
    0: <Welcome handleCreateAccount={handleCreateAccount} name={name} setName={setName}/>,
    1: <Dashboard history={history} name={name} attempts={attempts} day={day} PLAN={PLAN} handleChangePage={handleChangePage} daysWords={daysWords} datetime={datetime} />,
    2: <Challenge handleChangePage={handleChangePage} handleCompleteDay={handleCompleteDay} handleIncrementAttempts={handleIncrementAttempts} day={day} daysWords={daysWords} PLAN={PLAN} />
  }

  return (
    <Layout>
      {pages[selectedPage]}
    </Layout>
  )
  
}

export default App;
