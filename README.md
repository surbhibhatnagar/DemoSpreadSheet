This is a simple spreadsheet like program limited to 10*10 sheet.
Type macros like =MUL(A0, A1) OR =MUL(A0, A1) to multiply/add values of 2 cells and press enter

How to run:
Go to project folder on your local disk -> open index.html
To run on local host:
1. Change directory to project folder
2. Run following command on terminal:
	php -S localhost:8080
Approach: Keep track of dependent cells in dependent[] array and track macro expressions with
corresponding cell indices by storing these values in 10*10 matrix

Future work: Remove macros from 10*10 matrix after user overwrites macro with some other numeric value