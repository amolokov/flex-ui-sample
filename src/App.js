import React from 'react';
import * as Flex from '@twilio/flex-ui';

class App extends React.Component {

  state = {};

  constructor(props) {
    super(props);

    const { configuration } = props;
    Flex.ContactCenterManager.create(undefined, configuration)
      .then(manager => this.setState({ manager }))
      .catch(error => this.setState({ error }));
  }

  render() {
    const { manager, error } = this.state;
    if (manager) {
      return (
        <Flex.ContextProvider manager={manager}>
          <Flex.RootContainer />
        </Flex.ContextProvider>
      );
    }

    if (error) {
      console.error("Failed to initialize Flex", error);
    }

    return null;
  }
}

export default App;
