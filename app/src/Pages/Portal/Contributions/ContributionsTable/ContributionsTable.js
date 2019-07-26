import React from "react";
import PageHoc from "../../../../components/PageHoc/PageHoc";
import { connect } from "react-redux";
import Table from "../../../../components/Table";

const ContributionsTable = ({ ...props }) => (
    <PageHoc>
        <h1>Contributions</h1>
        <Table/>
    </PageHoc>
)

export default connect()(ContributionsTable);