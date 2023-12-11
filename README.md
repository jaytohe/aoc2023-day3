My solution to [Advent of Code - Day 3](https://adventofcode.com/2023/day/3) written in Javascript/NodeJS.

I basically read the whole puzzle input into a big string and use regexps to find the positions of the digits and the symbols in the string. Then I can easily check whether a part number is adjacent to a symbol by scanning around the symbols.

