import {
  VisualizationColors,
  VictoryTheme,
} from '@hackoregon/component-library';

const { categorical } = VisualizationColors;
const victoryColors = [
  categorical.blue.hex,
  categorical.green.hex,
  categorical.yellow.hex,
  categorical.pink.hex,
  categorical.purple.hex,
];

export default {
  ...VictoryTheme,
  group: { ...VictoryTheme.group, colorScale: victoryColors },
  legend: { ...VictoryTheme.legend, colorScale: victoryColors },
  pie: { ...VictoryTheme.pie, colorScale: victoryColors },
  stack: { ...VictoryTheme.stack, colorScale: victoryColors },
};
