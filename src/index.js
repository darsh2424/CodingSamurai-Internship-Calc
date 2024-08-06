import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './main.css';

const Index = () => {
  const [BodyTheme, changeBodyTheme] = useState(true);
  const [textCalc, changeTextCalc] = useState('0');
  const [upText, changeUpText] = useState(null);
  const [firstOperand, setFirstOperand] = useState(null);
  const [op, setOp] = useState(null);
  const [isNewNum, setIsNewNum] = useState(false);
  const [result, setResult] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('calcHistory')) || [];
    setHistory(savedHistory);
  }, []);

  const numberClick = (c) => {
    if (textCalc.includes('.') && c === '.') return;

    if (isNewNum || result) {
      changeTextCalc(c);
      setIsNewNum(false);
      setResult(false);
    } else {
      changeTextCalc(textCalc === '0' ? c : textCalc + c);
    }
  };

  const oprClick = (c) => {
    setFirstOperand(parseFloat(textCalc));
    setOp(c);
    changeUpText(textCalc + ' ' + c + ' ');
    changeTextCalc('0');
    setIsNewNum(true);
  };

  const handleClearClick = () => {
    changeTextCalc('0');
  };

  const handleClearAll = () => {
    changeTextCalc('0');
    setFirstOperand(null);
    changeUpText(null);
    setOp(null);
    setIsNewNum(false);
  };

  const handleEqualsClick = () => {
    if (op && firstOperand !== null) {
      const secondOperand = parseFloat(textCalc);
      let resultValue;
      switch (op) {
        case '+':
          resultValue = firstOperand + secondOperand;
          break;
        case '−':
          resultValue = firstOperand - secondOperand;
          break;
        case '×':
          resultValue = firstOperand * secondOperand;
          break;
        case '÷':
          if (secondOperand === 0) {
            alert('Cannot divide by zero');
            return;
          }
          resultValue = firstOperand / secondOperand;
          break;
        case '%':
          resultValue = (firstOperand * secondOperand) / 100;
          break;
        default:
          return;
      }
      const historyEntry = `${firstOperand} ${op} ${secondOperand} = ${resultValue}`;
      const updatedHistory = [historyEntry, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('calcHistory', JSON.stringify(updatedHistory));

      changeUpText(upText + textCalc);
      changeTextCalc(resultValue.toString());
      setResult(true);
      setFirstOperand(null);
      setOp(null);
      setIsNewNum(false);
    }
  };

  const historyClick = () => {
    setShowHistory(!showHistory);
    document.getElementById('num-div').classList.toggle('blur');
    document.getElementById('fun-div').classList.toggle('blur');
    document.getElementById('history').classList.toggle('d-none');
  };

  const handleHistoryClick = (entry) => {
    const [operation, result] = entry.split('=').map(item => item.trim());
    changeTextCalc(result);
    setFirstOperand(parseFloat(result));
    setOp(null);
  };

  const themeChange = () => {
    changeBodyTheme(!BodyTheme);
    document.body.style.background = BodyTheme ? 'black' : 'white';
    document.body.style.color = BodyTheme ? 'white' : 'black';
    document.getElementById('uptext').style.background = BodyTheme ? 'black' : 'white';
    document.getElementById('history').style.background = BodyTheme ? 'black' : 'white';
  };

  return (
    <>
      <nav className={BodyTheme ? 'navbar bg-body-tertiary' : 'navbar bg-dark text-white'}>
        <div className="container-fluid">
          <a className={BodyTheme ? 'navbar-brand' : 'navbar-brand text-white'} href="/">Calc.</a>
          <div className="d-flex justify-content-md-end">
            <button onClick={themeChange} className={BodyTheme ? 'btn bg-body-tertiary' : 'btn btn-outline-dark text-white'}>
              {BodyTheme ? <i className="fa-regular fa-moon fs-5 mx-5"></i> : <i className="fa-solid fa-moon fs-5 mx-5"></i>}
            </button>
          </div>
        </div>
      </nav>

      <div className="container mt-2 p-4 main-div">
        <form className="calc-form">
          <div className="row">
            <div className="col-md-12">
              <input
                type="text" id="uptext"
                className={BodyTheme ? 'form-control form-control-sm mb-1 fs-6' : 'form-control form-control-sm mb-1 fs-6 text-white'}
                style={{ textAlign: 'right' }} value={upText || ''} disabled
              />
              <input
                type="text"
                className={BodyTheme ? 'form-control form-control-lg p-4' : 'form-control form-control-lg p-4 text-white bg-dark'}
                style={{ textAlign: 'right' }} value={textCalc} disabled
              />
            </div>
          </div>
          <div id='history' className="container w-50 p-3 d-none history">
            <button type='button' id='historyClose' className='btn btn-danger p-2' onClick={historyClick}><i className="fa-solid fa-xmark"></i></button>
            {history.map((entry, index) => (
              <div className='row' key={index}>
                <div className='col-md-12 mt-2'>
                  <button
                    type='button'
                    onClick={() => handleHistoryClick(entry)}
                    className={BodyTheme ? 'btn history-item w-100' : 'btn history-item w-100 text-white'}
                  >
                    {entry}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="row mt-2">
            <div id='num-div' className="col num-div">
              <div className="container p-3">
                {['789', '456', '123', '0.'].map((row, idx) => (
                  <div className="row mb-2 d-flex justify-content-center" key={idx}>
                    {row.split('').map((char, i) => (
                      <div className="col-4 p-1" key={i}>
                        <button
                          type="button"
                          className={BodyTheme ? 'btn btn-light p-3 w-100' : 'btn btn-dark p-3 w-100'}
                          onClick={() => numberClick(char)}
                        >
                          {char}
                        </button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="col fun-div">
              <div id='fun-div' className="container mt-2 p-3">
                {['÷%C', '×−', '=+'].map((row, idx) => (
                  <div className="row mb-2" key={idx}>
                    {row.split('').map((char, i) => (
                      <div className="col-4 p-1" key={i}>
                        <button
                          type="button"
                          className={BodyTheme ? 'btn btn-light fs-4 p-2 w-100' : 'btn btn-danger fs-4 p-2 w-100'}
                          onClick={() => char === 'C' ? handleClearClick() : char === 'Clear' ? handleClearAll() : char === '=' ? handleEqualsClick() : oprClick(char)}
                        >
                          {char}
                        </button>
                      </div>
                    ))}
                  </div>
                ))}
                <div className="row mb-2">
                  <div className="col-12 p-1">
                    <button
                      type="button"
                      className={BodyTheme ? 'btn btn-danger p-3 w-100' : 'btn btn-dark p-3 w-100'}
                      onClick={handleClearAll}
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-12 p-1">
                    <button
                      type="button"
                      className={BodyTheme ? 'btn btn-info p-3 w-100' : 'btn btn-info p-3 w-100'}
                      onClick={historyClick}
                    >
                      <i className="fa-solid fa-clock-rotate-left"></i> History
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Index />);
