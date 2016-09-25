import React, {Component, PropTypes} from 'react'
import processImage from './support.js'
import {Image} from 'react-native'

const roundToNearest = (size, precision) => precision * Math.ceil(size / precision)

const defaultMap = {
  width: 'defaultWidth',
  height: 'defaultHeight'
}

const findSizeForDimension = (dim, props = {}, state = {}) => {
  if (props[dim]) {
    return props[dim]
  } else if (props.fluid && state[dim]) {
    return roundToNearest(state[dim], props.precision)
  } else if (props[defaultMap[dim]]) {
    return props[defaultMap[dim]]
  } else {
    return 1
  }
}

export default class ReactImgix extends Component {
  static propTypes = {
    source: PropTypes.string.isRequired,
    className: PropTypes.string,
    bg: PropTypes.bool,
    fit: PropTypes.string,
    auto: PropTypes.array,
    faces: PropTypes.bool,
    aggressiveLoad: PropTypes.bool,
    fluid: PropTypes.bool,
    customParams: PropTypes.object,
    entropy: PropTypes.bool,
    generateSrcSet: PropTypes.bool
  };
  static defaultProps = {
    precision: 100,
    bg: false,
    fluid: true,
    aggressiveLoad: false,
    faces: true,
    fit: 'crop',
    entropy: false,
    auto: ['format'],
    generateSrcSet: true
  };
  state = {
    width: null,
    height: null,
    mounted: false
  };

  _findSizeForDimension = dim => findSizeForDimension(dim, this.props, this.state);

  render () {
    const {
      aggressiveLoad,
      auto,
      bg,
      customParams,
      entropy,
      faces,
      fit,
      generateSrcSet,
      source,
      ...other
    } = this.props
    let _src = ''
    let srcSet = ''

    let width = this._findSizeForDimension('width')
    let height = this._findSizeForDimension('height')

    let crop = false
    if (faces) crop = 'faces'
    if (entropy) crop = 'entropy'

    let _fit = false
    if (entropy) _fit = 'crop'
    if (fit) _fit = fit

    if (this.state.mounted || aggressiveLoad) {
      const srcOptions = {
        auto: auto,
        ...customParams,
        crop,
        fit: _fit,
        width,
        height
      }

      _src = processImage(source, srcOptions)
      const dpr2 = processImage(source, {...srcOptions, dpr: 2})
      const dpr3 = processImage(source, {...srcOptions, dpr: 3})
      srcSet = `${dpr2} 2x, ${dpr3} 3x`
    }

    let childProps = {
      ...this.props.imgProps,
      width: other.width <= 1 ? null : other.width,
      height: other.height <= 1 ? null : other.height
    }

    return <Image {...childProps} source={{uri: source}} />;
  }
}
