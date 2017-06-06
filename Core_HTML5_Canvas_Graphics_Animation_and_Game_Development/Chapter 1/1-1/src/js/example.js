const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

context.font = '38pt Arial';
context.fillStyle = 'cornflowrblue';
context.strokeStyle = 'blue';

context.fillText('Hello Canvas', canvas.width / 2 - 150, canvas.height / 2 + 15);
context.strokeText('Hello Canvas', canvas.width / 2 - 150, canvas.height / 2 + 15);