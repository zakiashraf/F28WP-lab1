var ourRequest = new XMLHttpRequest();
ourRequest.open('GET', 'https://github.com/zakiashraf/F28WP-lab1/edit/main/week4/cities1.json');
ourRequest.onload = function() {
console.log(ourRequest.responseText);
};
ourRequest.send();
