import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

export const scale = (size: number) =>
  PixelRatio.roundToNearestPixel((width / guidelineBaseWidth) * size);

export const verticalScale = (size: number) =>
  PixelRatio.roundToNearestPixel((height / guidelineBaseHeight) * size);

//-----------------------------------------
// scale is used for...
/*
  paddingHorizontal
  marginHorizontal
  width
  icon sizes
  button widths
  horizontal gaps
  
*/
//-----------------------------------------

//-----------------------------------------
// verticalScale is used for...
/*
  marginTop
  marginBottom
  paddingVertical
  height
  card height
  bottom spacing
  top spacing
*/
//-----------------------------------------
