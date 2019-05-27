import React, { Component } from "react";
/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import loader from "../../assets/styles/emotion-globals/loader";

class SearchBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedItem: 0,
      searchString: "",
      guesses: [
        { label: "Name", value: "Hola" },
        { label: "sup", value: "Hola2" },
        { label: "sup", value: "Hola4" }
      ]
    };

    this.onSearchQueryChange = props.onSearchQueryChange || (value => {});
    this.onSearchResultSelected = props.onSearchResultSelected || (value => {});

    this.onInputChange = this.onInputChange.bind(this);
    this.onUpDownNavigation = this.onUpDownNavigation.bind(this);
    this.onMouseDownOverGuessItem = this.onMouseDownOverGuessItem.bind(this);
    this.onHoverOverGuessItem = this.onHoverOverGuessItem.bind(this);
  }

  // Event Handlers
  onInputChange(event) {
    this.setState({ searchString: event.target.value });
    this.onSearchQueryChange(event.target.value);
  }

  onUpDownNavigation(e) {
    // key:code map
    //
    // up: 38   | down: 40
    // enter: 13

    // Make sure no Alt, Ctrl, Cmmd key pressed with this
    const withModifierKey = e.altKey || e.ctrlKey || e.shiftKey || e.metaKey;

    // Down Key
    if (e.keyCode === 40 && !withModifierKey) {
      const newSelectedItem = Math.min(
        this.props.guesses.length - 1,
        this.state.selectedItem + 1
      );
      this.setState({ selectedItem: newSelectedItem });

      // Up Key
    } else if (e.keyCode === 38 && !withModifierKey) {
      const newSelectedItem = Math.max(0, this.state.selectedItem - 1);
      this.setState({ selectedItem: newSelectedItem });

      // Enter Key
    } else if (e.keyCode === 13) {
      this.selectGuessItem(this.props.guesses[this.state.selectedItem]);
      e.target.blur();
    }
  }

  onHoverOverGuessItem(e) {
    const i = e.currentTarget.dataset.index;
    this.setState({ selectedItem: Number(i) });
  }

  onMouseDownOverGuessItem(e) {
    const itemIndex = e.currentTarget.dataset.index;
    this.selectGuessItem(this.props.guesses[itemIndex]);
  }

  // Helper Functions
  selectGuessItem(item) {
    this.setState({ searchString: item.value });

    this.onSearchResultSelected(item);
  }

  // Render Functions
  renderGuessesList(guesses) {
    if (guesses.length) {
      return guesses.map((item, i) => (
        <li
          key={i}
          data-index={i}
          className={
            "guess-item" + (i === this.state.selectedItem ? " focused" : "")
          }
          onMouseEnter={this.onHoverOverGuessItem}
          onMouseDown={this.onMouseDownOverGuessItem}
        >
          <a href={"javascript:void"}>
            <span className={"item-label"}>{item.label}</span>
            {item.value}
          </a>
        </li>
      ));
    } else {
      return <li className={"no-guess-item"}>No Result</li>;
    }
  }

  render() {
    const guessesList = this.renderGuessesList(this.props.guesses);

    return (
      <div css={this.styles()}>
        {this.props.isLoading ? (
          <div className={"loader"} css={loader(20, "#000")}>
            Loading...
          </div>
        ) : (
          ""
        )}
        <input
          placeholder={this.props.placeholder}
          type="text"
          value={this.state.searchString}
          onChange={this.onInputChange}
          onKeyDown={this.onUpDownNavigation}
        />

        {!this.props.isLoading && this.state.searchString.trim().length ? (
          <ul className={"guesses-list"}>{guessesList}</ul>
        ) : (
          ""
        )}
      </div>
    );
  }

  // Styles
  styles() {
    return css`
      display: inline-block;
      position: relative;

      &:focus-within .guesses-list {
        //input:focus + .guesses-list {
        display: block;
      }

      input {
        font-size: 20px;
        padding-right: 30px;
      }

      input + .guesses-list {
        display: none;
        padding: 0;
        margin: 0;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        animation: enterResults 0.2s;

        .guess-item {
          a {
            display: block;
            padding: 10px;
            color: inherit;
          }

          //> a:hover,
          > a:focus {
            background: rgba(0, 0, 0, 0.1);
          }

          &.focused > a {
            background: rgba(0, 0, 0, 0.1) !important;
          }

          .item-label {
            font-size: 0.8em;
            display: inline-block;
            background: rgba(0, 0, 0, 0.2);
            margin: 0px 5px 0px -5px;
            padding: 2px 4px;
            border-radius: 5px;
            color: #444;
          }
        }

        .no-guess-item {
          text-align: center;
          padding: 10px;
          color: #666;
        }
      }

      .loader {
        position: absolute;
        right: 5px;
        top: 3px;
      }

      @keyframes enterResults {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }
    `;
  }
}

export default SearchBox;
