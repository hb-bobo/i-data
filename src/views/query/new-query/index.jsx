import React, { Component } from 'react';
interface HelloProps {
  compiler: string;
  framework: string;
}
const func = function (props: HelloProps) {
  console.log(props)
}

func({
  compiler: 'a',
  framework: 'b'
})
class NewQuery extends Component {
    constructor ({ match, location, history }) {
        super()
        console.log(match, location, history)
        this.state = {
            a: 1
        }
    }
    render () {
        return (
            <div>
                {this.a}
            </div>
        )
    }
}

/*const NewQuery = ({ match, location, history }) => (
  <div>
    <h3>ID: {match.params.path}{location.key}</h3>
    <h3>{history.action}</h3>
  </div>
)*/
export default NewQuery;