import * as React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withKnobs, object } from "@storybook/addon-knobs";
import SearchBox from "../src/components/SearchBox/SearchBox";

const dummySearchResults = {
  test: [{ label: "Name", value: "Hi" }],
  test2: [{ label: "Name", value: "Hola" }, { label: "sup", value: "Hola2" }]
};

export default () =>
  storiesOf("UI Components/Search Box", module)
    .addDecorator(withKnobs)
    .add("Simple Example", () => {
      const knobData = object("Query/Results", dummySearchResults, "GROUP-ID1");
      return <SearchBoxWrapper dummyData={knobData} />;
    });

class SearchBoxWrapper extends React.Component {
  timeOut = null;

  constructor(props) {
    super(props);

    this.state = {
      guesses: [],
      isLoading: false
    };
  }

  mockResultFinder(query) {
    const dummyData = this.props.dummyData;

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(dummyData[query] || []);
      }, 1000);
    });
  }

  onSearchQueryChange(query) {
    // Storybook Action
    action("onSearchQueryChange")(query);

    if (query.trim()) {
      this.setState({ isLoading: true });

      if (this.timeOut) {
        clearInterval(this.timeOut);
      }

      this.timeOut = setTimeout(() => {
        this.mockResultFinder(query).then(results => {
          this.setState({ guesses: results, isLoading: false });
        });
      }, 500);
    }
  }

  onSearchResultSelected(item) {
    // Storybook Action
    action("onSearchResultSelected")(item);
  }

  render() {
    return (
      <SearchBox
        isLoading={this.state.isLoading}
        guesses={this.state.guesses}
        placeholder={"Search"}
        onSearchQueryChange={this.onSearchQueryChange.bind(this)}
        onSearchResultSelected={this.onSearchResultSelected}
      />
    );
  }
}
