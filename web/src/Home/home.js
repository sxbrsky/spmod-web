import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder } from '@fortawesome/free-solid-svg-icons'

export class Home extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      error: null,
      isLoaded: false,
      builds: []
    }
  }

  componentDidMount () {
    fetch('https://localhost:8080/api/builds')
      .then(r => r.json())
      .then(r => {
        this.setState({
          isLoaded: true,
          builds: r
        })
      }, error => {
        this.setState({
          isLoaded: true,
          error
        })
      })
  }

  render () {
    const { isLoaded, error, builds } = this.state

    if (error) return <span>{error.stack}</span>
    if (!isLoaded) return <span>Loading...</span>

    return (
      <table>
        <thead>
          <tr>
            <th>Build</th>
            <th>Commit</th>
          </tr>
        </thead>
        <tbody>
          {builds.map(b => (
            <tr key={b.build}>
              <td>
                <FontAwesomeIcon icon={faFolder} />
                <Link to={`/builds/${b.build}`}>{b.build}</Link>
              </td>
              <td>
                <a href={`https://github.com/Amaroq7/SPmod/commit/${b.commit}`}>{b.commit}</a>
              </td>
            </tr>
          )
          )}
        </tbody>
      </table>
    )
  }
}
