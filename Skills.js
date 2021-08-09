import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import CONFIG from "../../config";
import * as Icon from "react-bootstrap-icons";
import RemoteService from "../../utils/RemoteService";
import Navbar from "../Navbar";
import "../../public/css/global.css";

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.buttonHandler = this.buttonHandler.bind(this);
    this.updateChange = this.updateChange.bind(this);
    this.state = {
      payload: {},
      template: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.type && nextProps.type != "") {
      this.setState({
        payload: nextProps.type.payloadStructure,
        template: nextProps
      });
    }
  }

  async buttonHandler() {
    let payload = Object.keys(this.state.payload);
    let payloadToSend = {};
    payload.map(el => {
      if (this.state.payload[el].length <= 0) {
        payloadToSend[el] = document.getElementById([el]).value;
      } else {
        payloadToSend[el] = this.state.payload[el];
      }
    });
    console.log(payloadToSend);
    let result = await RemoteService(
      this.state.template.type.httpMethod,
      this.state.template.type.endpoint,
      payloadToSend
    );
    console.log(result);
    if (result.status === "success") {
      this.forceUpdate();
    } else {
      Swal.fire({
        title: "Error",
        type: "error",
        text: `Unable to fetch Skills. Please contact Admin.`
      });
    }
  }

  updateChange(e) {
    let payload = this.state.payload;
    payload[e.target.getAttribute("id")] = e.target.value;
    this.setState({
      payload: payload
    });
  }

  render() {
    return (
      <div className="modal" id="exampleModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {this.props.title}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={this.props.closeModal}
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              {this.state.template.type &&
                this.state.template.type.template.map((el, index) => {
                  if (el.htmlType == "text") {
                    return (
                      <input
                        key={el.htmlValue + index}
                        type={el.htmlType}
                        className="form-control form-control-sm float-right "
                        id={el.id}
                        defaultValue={this.state.payload[el.id] || el.htmlValue}
                        placeholder={el.htmlPlaceholder}
                        onChange={this.updateChange}
                        readOnly={el.readOnly || false}
                      />
                    );
                  }
                })}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={this.buttonHandler}
              >
                {this.props.handler}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class Skills extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalTitle: "",
      handler: "",
      type: "",
      tableData: [],
      skillName: "",
      skillId: "",
      addSkillTemplate: {
        httpMethod: "POST",
        endpoint: CONFIG.SKILLS_ADD,
        payloadStructure: {
          skillName: ""
        },
        template: [
          {
            htmlType: "text",
            htmlPlaceholder: "Type in Skill Name",
            htmlValue: "",
            id: "skillName"
          }
        ]
      },
      editSkillTemplate: {
        httpMethod: "POST",
        endpoint: CONFIG.SKILLS_UPDATE,
        payloadStructure: {
          skillId: "",
          skillName: ""
        },
        template: [
          {
            htmlType: "text",
            htmlPlaceholder: "",
            htmlValue: "",
            readOnly: true,
            id: "skillId"
          },
          {
            htmlType: "text",
            htmlPlaceholder: "",
            htmlValue: "",
            id: "skillName"
          }
        ]
      },
      deleteSkillTemplate: {
        httpMethod: "POST",
        endpoint: CONFIG.SKILLS_DELETE,
        payloadStructure: {
          skillId: ""
        },
        template: [
          {
            htmlType: "text",
            htmlPlaceholder: "",
            htmlValue: "",
            readOnly: true,
            id: "skillId"
          },
          {
            htmlType: "text",
            htmlPlaceholder: "",
            htmlValue: "",
            readOnly: true,
            id: "skillName"
          }
        ]
      }
    };
    this.handleChange = this.handleChange.bind(this);
  }
  async componentDidMount() {
    try {
      let data = await RemoteService("GET", CONFIG.CONFIGURATION_SKILLS);

      this.setState({
        tableData: data
      });
      console.log(data);
    } catch (error) {
      console.log("Error: ", error);
      Swal.fire({
        title: "Error",
        type: "error",
        text: `Unable to fetch Users data. Please contact Admin.`
      });
    }
  }

  showModal(modalTitle, handler, type, auxiliaryParam = "") {
    if (auxiliaryParam.length > 0) {
      try {
        auxiliaryParam = JSON.parse(auxiliaryParam);
        let checkIfAuxiliaryParamsExists = Object.keys(auxiliaryParam);
        if (checkIfAuxiliaryParamsExists.length > 0) {
          let updateObj = JSON.parse(type);
          updateObj.template.map(el => {
            if (auxiliaryParam[el.id]) {
              el.htmlValue = auxiliaryParam[el.id];
            } else {
              el.htmlValue = "";
            }
          });
          console.log(updateObj);
          type = JSON.stringify(updateObj);
        }
      } catch (e) {
        console.log(`Error occured: ${e}`);
      }
    }
    this.setState({
      modalTitle: modalTitle,
      handler: handler,
      type: JSON.parse(type)
    });
    document.getElementById("exampleModal").style.display = "block";
    document.getElementById("exampleModal").style.backgroundColor =
      "rgba(0,0,0,0.6)";
  }

  closeModal() {
    document.getElementById("exampleModal").style.display = "none";
    document.getElementById("exampleModal").style.backgroundColor =
      "rgba(0,0,0)";
  }
  handleChange(e) {
    this.setState({ name: e.target.value });
  }

  render() {
    return (
      <React.Fragment>
        <Navbar />
        <div className="container mt-2">
          <div className="table-responsive">
            <button
              type="button"
              className="btn btn-outline-primary btn-sm float-right"
              onClick={() =>
                this.showModal(
                  "Add NewSkill",
                  "Add Skill",
                  JSON.stringify(this.state.addSkillTemplate)
                )
              }
            >
              <Icon.PlusCircle className="mb-1" />
              Add new skill{" "}
            </button>
            <table className="table ">
              <thead className="table-light">
                <tr>
                  <th>
                    Skill
                    <Icon.ChevronDoubleUp />
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {this.state.tableData.length > 0 &&
                  this.state.tableData.map((list, i) => (
                    <tr key={i}>
                      <td> {list["SKILLNAME"]}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-outline-success btn-sm  mr-4"
                          onClick={() =>
                            this.showModal(
                              "Edit Skill",
                              "Edit",
                              JSON.stringify(this.state.editSkillTemplate),
                              JSON.stringify({
                                skillId: list["ID"],
                                skillName: list["SKILLNAME"]
                              })
                            )
                          }
                        >
                          <Icon.PencilSquare className="mb-1" />
                          Edit{" "}
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm  "
                          onClick={() =>
                            this.showModal(
                              "Delete Skill",
                              "Delete",
                              JSON.stringify(this.state.deleteSkillTemplate),
                              JSON.stringify({
                                skillId: list["ID"],
                                skillName: list["SKILLNAME"]
                              })
                            )
                          }
                        >
                          <Icon.Trash className="mb-1" />
                          Remove{" "}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <Modal
          title={this.state.modalTitle}
          handler={this.state.handler}
          closeModal={this.closeModal}
          type={this.state.type}
          name={this.state.name}
        />
      </React.Fragment>
    );
  }
}

export default Skills;
