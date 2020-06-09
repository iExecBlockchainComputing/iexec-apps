#!/usr/local/bin/python

import argparse
import sys

# CLASS SUDOKU SOLVER
class Sudoku:
	def same_row(i,j): return i//9  == j//9
	def same_col(i,j): return i%9   == j%9
	def same_blk(i,j): return i//27 == j//27 and i%9//3 == j%9//3
	def dependent(i,j): return Sudoku.same_row(i,j) or Sudoku.same_col(i,j) or Sudoku.same_blk(i,j)
	def solve(grid):
		try:
			idx = next(i for i,v in enumerate(grid) if v not in "123456789")
		except:
			return grid

		exclude = set()
		for pos in range(81):
			if grid[pos] in "123456789":
				if Sudoku.dependent(pos,idx):
					exclude.add(grid[pos])
		for value in "123456789":
			if value not in exclude:
				ngrid = Sudoku.solve(grid[:idx]+value+grid[idx+1:])
				if ngrid: return ngrid
		return None
	def check(grid):
		if len(grid) != 81:
			raise argparse.ArgumentTypeError('Argument must be a valid sudoku grid (size must be 81)')
		for idx in range(81):
			if grid[idx] in "123456789":
				for pos in range(81):
					if idx != pos and grid[idx] == grid[pos]:
						if Sudoku.dependent(pos,idx):
							raise argparse.ArgumentTypeError('Argument must be a valid sudoku grid (positions %d and %d should not have the same value)' % (idx, pos))
			return grid

if __name__ == '__main__':

	parser = argparse.ArgumentParser(description='Sudoku solver')
	parser.add_argument('grid', type=Sudoku.check, help='A (linearized) sudoku grid')
	args = parser.parse_args()

	solution = Sudoku.solve(args.grid)
	if solution:
		sys.stdout.write(solution)
	else:
		sys.stderr.write("No valid solution for this grid")
		exit(1)