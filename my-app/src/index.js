import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
      <button className="square" onClick={props.onClick} style={{background: props.highlight ? "#FFEB3B" : "none"}}>
        {props.value}
      </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
        <Square
            value={this.props.squares[i]}
            highlight={this.props.highlight.indexOf(i) > -1 ? true : false}
            onClick={() => this.props.onClick(i)}
        />
    );
  }

  render() {
    return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        lastMove: null
      }],
      stepNumber: 0,
      xIsNext: true,
      descending: false
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const lastMove = {column: (i % 3) + 1, row: Math.floor(i / 3) + 1};
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        lastMove: lastMove
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const descending = this.state.descending;

    const moves = [];

    for (let i = (descending ? history.length - 1 : 0); (descending ? i >= 0 : i < history.length); (descending ? i-- : i++)) {
      const step = history[i];
      const desc = i ?
          'Go to move #' + i :
          'Go to game start';
      moves.push((
          <li key={i}>
            <span style={{"fontWeight": i === this.state.stepNumber ? "bold" : "normal"}}>
              {step.lastMove ? (`(${step.lastMove.column}, ${step.lastMove.row}) `) : "None "}
            </span>
            <button onClick={() => this.jumpTo(i)}>{desc}</button>
          </li>
      ));
    }

    let status;
    if (winner) {
      status = 'Winner: ' + winner.letter;
    } else {
      if (history.length === 10 && this.state.stepNumber === 9) {
        status = "Draw!";
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
    }

    return (
        <div className="game">
          <div className="game-board">
            <Board
                squares={current.squares}
                highlight={winner ? winner.highlight : []}
                onClick={(i) => this.handleClick(i)}
            />

          </div>
          <div className="game-info">
            <div>{status}</div>
            Move order: {descending ? "Descending" : "Ascending"} <button onClick={() => {
              this.setState({descending: !descending});
            }}>Change</button>
            <ol>{moves}</ol>
          </div>
        </div>
    );
  }
}

// ========================================

ReactDOM.render(
<Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {highlight: lines[i], letter: squares[a]};
    }
  }
  return null;
}
