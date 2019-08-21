// react
import React, { Component } from 'react'
// redux
import LoggedinOnly from '../containers/loggedin_only'
import EditGluon     from '../containers/edit_gluon'
import Util from '../utils/common';
import Api from '../utils/api'

class EditGluonWrapper extends Component {
  state = {
    gluon: null,
    active: null,
    passive: null
  }

  constructor(props) {
    super(props);
    this.api = new Api()
  }

  componentDidMount() {
    this.setGluon()
  }

  componentDidUpdate(prevProps, prevState){
    const { gluon } = this.state;
    if (gluon) {
      if (!prevState.gluon || (gluon.identity !== prevState.gluon.identity)) {
        this.setActive(gluon.start_node)
        this.setPassive(gluon.end_node)
      }
    }
  }

  setGluon = async () => {
    const result = await this.api.call(`gluons/${this.props.match.params.id}`, 'get')
    const gluon = result.data
    this.setState({gluon})
  }
  setActive = async (identity) => {
    const result = await this.api.call(`quarks/${identity}`, 'get')
    const active = result.data
    this.setState({active})
  }
  setPassive = async (identity) => {
    const result = await this.api.call(`quarks/${identity}`, 'get')
    const passive = result.data
    this.setState({passive})
  }

  render () {
    const { gluon, active, passive } = this.state
    if (!gluon || !active || !passive) {
      return (
        <div>Loading...</div>
      )
    }

    let util = new Util();
	  gluon.values.start = util.date2str(gluon.values.start, 'day');
	  gluon.values.end = util.date2str(gluon.values.end, 'day');
    return (
      <LoggedinOnly>
        <EditGluon initialValues={{...gluon.values, identity:this.props.match.params.id}}
                   active={active} passive={passive} />
      </LoggedinOnly>
    )
  }
}

export default EditGluonWrapper
