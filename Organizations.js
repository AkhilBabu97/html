import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from "sweetalert2";
import CONFIG from '../../config';
import * as Icon from 'react-bootstrap-icons';
import RemoteService from '../../utils/RemoteService';
import Navbar from '../Navbar';
import { Link } from 'react-router-dom';
import '../../public/css/global.css';
import { program } from '@babel/types';

class Organizations extends React.Component {
	constructor(props) {
        super(props);
        this.showPrograms = this.showPrograms.bind(this);
        this.showSubPrograms = this.showSubPrograms.bind(this);
        this.showHiringManagers = this.showHiringManagers.bind(this);
		this.state = {
            orgs: [],
            isShowingPrograms: false,
            isShowingSubPrograms: false,
            isShowingHiringManagers: false
        }
	}

    async componentDidMount() {
        let result = await RemoteService('GET', CONFIG.CONFIGURATION_ORGS);
        console.log(result);
        this.setState({
            orgs: result
        });
    }

    showHideUtility(data, shouldShow=true) {
        if(shouldShow) {
            data.forEach((data) => {
                data.classList.remove("display-none");
            });
        } else {
            data.forEach((data) => {
                data.classList.add("display-none");
            });
        }
    }

    showPrograms(orgName) {
        let data = document.querySelectorAll(`*[id^="${orgName}"]`);
        if(this.state.isShowingPrograms) {
            this.showHideUtility(data, false);
            this.setState({
                isShowingPrograms: false
            });
        } else {
            this.showHideUtility(data, true);
            this.setState({
                isShowingPrograms: true
            });
        }
    }

    showSubPrograms(orgName, programName) {
        var data = document.querySelectorAll(`*[id^="${programName}"]`);
        if(this.state.isShowingSubPrograms) {
            this.showHideUtility(data, false);
            this.setState({
                isShowingSubPrograms: false
            });
        } else {
            this.showHideUtility(data, true);
            this.setState({
                isShowingSubPrograms: true
            });
        }
    }

    showHiringManagers(orgName, programName, subProgramName) {
        let data = document.querySelectorAll(`*[id^="${subProgramName}"]`);
        if(this.state.isShowingHiringManagers) {
            this.showHideUtility(data, false);
            this.setState({
                isShowingHiringManagers: false
            });
        } else {
            this.showHideUtility(data, true);
            this.setState({
                isShowingHiringManagers: true
            });
        }

    }

	render() {
			return (
				<React.Fragment>
					<Navbar />
                    <div className="container">
                        {
                            this.state.orgs.map((org) => {
                                return <div className="card p-4">
                                        <div className="row shadow p-3 mb-1 bg-white rounded">
                                            <div className="col-lg-11">
                                                <h5>
                                                    <Icon.PlusCircleFill className="cursor-pointer" onClick={() => this.showPrograms(org.orgName)} />
                                                    &emsp;
                                                    {org.orgName} - {org.orgLead}
                                                </h5>
                                            </div>
                                            <div className="col-lg-1">
                                                <button className="btn btn-sm btn-custom">
                                                    <Icon.PencilFill />
                                                </button>
                                                &emsp;
                                                <button className="btn btn-sm btn-custom">
                                                    <Icon.Trash2 />
                                                </button>
                                            </div>
                                        </div>
                                        {
                                            org.programs.map((program) => {
                                                return <div style={{marginLeft: "16px"}} key={program.programName} id={`${org.orgName}-${program.programName}-${(Math.random() + 1).toString(36).substring(7)}`} className="display-none">
                                                    <div className="row  shadow p-3 mb-2 bg-white rounded">
                                                    <div className="col-lg-11">
                                                        <h5>
                                                            <Icon.PlusCircleFill className="cursor-pointer"  onClick={() => this.showSubPrograms(org.orgName, program.programName)} />
                                                            &emsp;
                                                            {program.programName} - {program.programLead}
                                                        </h5>
                                                    </div>
                                                    <div className="col-lg-1">
                                                        <button className="btn btn-sm btn-custom">
                                                            <Icon.PencilFill />
                                                        </button>
                                                        &emsp;
                                                        <button className="btn btn-sm btn-custom">
                                                            <Icon.Trash2 />
                                                        </button>
                                                    </div>
                                                    <br />
                                                    <br />
                                                    </div>
                                                {
                                                    program.subPrograms.map((subProgram) => {
                                                        return <div style={{marginLeft: "16px"}} key={subProgram.subProgramName} id={`${program.programName}-${subProgram.subProgramName}-${(Math.random() + 1).toString(36).substring(7)}`} className="row shadow p-3 mb-2 bg-white rounded display-none">
                                                            <div className="col-lg-11">
                                                                <h5>
                                                                    <Icon.PlusCircleFill className="cursor-pointer"  onClick={() => this.showHiringManagers(org.orgName, program.programName, subProgram.subProgramName)} />
                                                                    &emsp;
                                                                    {subProgram.subProgramName} - {subProgram.subProgramLead}
                                                                </h5>
                                                                </div>
                                                                <div className="col-lg-1">
                                                                    <button className="btn btn-sm btn-custom">
                                                                        <Icon.PencilFill />
                                                                    </button>
                                                                    &emsp;
                                                                    <button className="btn btn-sm btn-custom">
                                                                        <Icon.Trash2 />
                                                                    </button>
                                                                </div>
                                                                <br />
                                                                <br />
                                                            {
                                                                subProgram.hiringManagers[0].map((hiringManager) => {
                                                                    return <div key={hiringManager.HIRINGMANAGER} id={`${subProgram.subProgramName}-${hiringManager.ID}-${(Math.random() + 1).toString(36).substring(7)}`} className="row mt-2 shadow bg-white rounded display-none">
                                                                        <div className="col-lg-11">
                                                                                <table className="table table-sm table-striped">
                                                                                    <tr>
                                                                                        <td><h6>{hiringManager.HIRINGMANAGER}</h6></td>
                                                                                        <td>{hiringManager.HIRINGMANAGEREMAIL}</td>
                                                                                        <td>{hiringManager.SKILLS}</td>
                                                                                    </tr>
                                                                                </table>
                                                                            </div>
                                                                            <div className="col-lg-1">
                                                                                <button className="btn btn-sm btn-custom">
                                                                                    <Icon.PencilFill />
                                                                                </button>
                                                                                &emsp;
                                                                                <button className="btn btn-sm btn-custom">
                                                                                    <Icon.Trash2 />
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                })
                                                            }
                                                        </div>
                                                    })
                                                }



                                            </div>








                                        })
                                    }
                                </div>
                            })
                        }
                    </div>
				</React.Fragment>
			);
	}
}

export default Organizations;