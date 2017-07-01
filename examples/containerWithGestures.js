import React, { Component } from 'react';
import { Dimensions, View } from 'react-native';

import Behavior from '../behavior';

const { height, width } = Dimensions.get('window');

export default class extends Component {
  state = { closed: true, expanded: false };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Behavior
          ref={ref => (this.behavior = ref)}
          states={[
            { backgroundColor: '#db4437', height: 100 },
            { backgroundColor: '#0f9d58', height: 300 },
            { backgroundColor: '#4285f4', height: height - 20 }
          ]}
          style={{
            bottom: 0,
            position: 'absolute',
            width
          }}
          enableGestures
          onGesture={gesture => {
            if (gesture.swipedUp)
              if (this.state.closed)
                this.setState({ closed: false }, () =>
                  this.behavior.animateTo(1)
                );
              else
                this.setState({ expanded: true }, () =>
                  this.behavior.animateTo(2)
                );
            else if (gesture.swipedDown)
              if (this.state.expanded)
                this.setState({ expanded: false }, () =>
                  this.behavior.animateTo(1)
                );
              else
                this.setState({ closed: true }, () =>
                  this.behavior.animateTo(0)
                );
          }}
          indices={[0, 1, 2]} // android only
        />
      </View>
    );
  }
}
