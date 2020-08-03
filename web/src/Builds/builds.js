import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileArchive, faLevelUpAlt } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'

export class Builds extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      isLoaded: false,
      error: null,
      build: []
    }
  }

  componentDidMount () {
    const match = this.props.match
    const { id } = match.params

    fetch(`https://localhost:8080/api/builds/${id}`)
      .then(r => r.json())
      .then(r => {
        this.setState({
          isLoaded: true,
          build: r
        })
      }, error => {
        this.setState({
          isLoaded: true,
          error
        })
      })
  }

  render () {
    const { isLoaded, error, build } = this.state
    if (!isLoaded) return <div>Loading...</div>
    if (error) return <div>{error.stack}</div>

    return (
      <table>
        <thead>
          <tr>
            <th>File</th>
            <th>Size</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <FontAwesomeIcon icon={faLevelUpAlt} />
              <Link to='/'>Parent directory</Link>
            </td>
            <td />
          </tr>
          {build.files.map(f => (
            <tr key={f.file}>
              <td>
                <FontAwesomeIcon icon={faFileArchive} />
                <a href={`/builds/${f.file}`} download>{f.file}</a>
              </td>
              <td>{f.size} kb</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
}
