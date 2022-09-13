import * as React from 'react';
import { useEffect, useState } from 'react';
import { sp } from "@pnp/sp/presets/all";

export const LeftNavigation = () => {
    const [error, setError] = useState(null);
    const [policyTypes, setPolicyTypes] = useState([]);
    useEffect(() => {
        const getPolicyTypes = async () => {
            const policyTypes = await sp.web.lists.getByTitle('PolicyType').items
                .select("Id,Title")
                .top(100)().then((items: [{ Id: number, Title: string }]) => {
                    return items
                })
                .catch((exception) => {
                    throw new Error(exception);
                });
            setPolicyTypes(policyTypes);
        }
        getPolicyTypes().catch((error) => {
            setError(error);
        })
    }, [])

    if (error) {
        throw error;
    }

    return (
        <>
            <div className="col-lg-3 mb-3 mb-md-0">
                <div className="sidebar-nav">
                    <div className="sidebar-menu dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button" id="sidebarMenuDropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">General Policies</button>
                        <ul className="nav nav-tabs dropdown-menu" id="policiesTab" role="tablist">
                            {policyTypes.map((policyType: { Title: string }, index: number) => {
                                return (<>
                                    <li className="nav-item" role="presentation">
                                        <button className={`nav-link ${!index ? 'active' : ''}`} id="general-tab" data-bs-toggle="tab" data-bs-target="#general-tab-content" type="button" role="tab" aria-controls="home" aria-selected="false">{policyType.Title}</button>
                                    </li>
                                </>)
                            })}
                            {
                                !policyTypes.length && <li className="nav-item" role="presentation">
                                    <button className="nav-link" id="hr-tab" data-bs-toggle="tab" data-bs-target="#hr-tab-content" type="button" role="tab" aria-controls="profile" aria-selected="false">No  items found</button>
                                </li>
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}