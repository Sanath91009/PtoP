import React from "react";
import { HandleForm } from "./handleForm";

export const PorfileInfo = (props) => {
    const { section, HandleSubmit } = props;
    return (
        <div class="card">
            <div class="card-header" id={section}>
                <h5 class="mb-0">
                    <button
                        class="btn btn-danger collapsed"
                        data-bs-toggle="collapse"
                        data-bs-target={`#Collapse${section}`}
                        aria-expanded="false"
                        aria-controls={`Collapse${section}`}
                        style={{ width: "130px" }}
                    >
                        {section}
                    </button>
                </h5>
            </div>

            <div
                id={`Collapse${section}`}
                class="collapse"
                aria-labelledby={section}
                data-bs-parent="#accordion"
            >
                <div class="card-body">
                    <HandleForm onSubmit={HandleSubmit} />
                </div>
            </div>
        </div>
    );
};
