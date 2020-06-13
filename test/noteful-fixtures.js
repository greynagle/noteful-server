function makeFolderArray() {
  return [
    {
      id: 1,
      name: 'this',
    },
    {
      id: 2,
      name: 'is',
    },
    {
      id: 3,
      name: 'silly',
    },
  ]
}

function makeNoteArray() {
  return [
    {
      id: 1,
      name: 'my',
	  mod_date: new Date(),
	  content:"look at all this content",
	  folder_id:3
    },
	{
      id: 2,
      name: 'goodness',
	  mod_date: new Date(),
	  content:"look at all this content",
	  folder_id:2
    },
	{
      id: 3,
      name: 'this',
	  mod_date: new Date(),
	  content:"look at all this content",
	  folder_id:1
    },
	{
      id: 4,
      name: 'is',
	  mod_date: new Date(),
	  content:"look at all this content",
	  folder_id:2
    },
	{
      id: 5,
      name: 'tedious',
	  mod_date: new Date(),
	  content:"look at all this content",
	  folder_id:1
    },
    {
      id: 6,
      name: 'to type',
	  mod_date: new Date(),
	  content:"look at all this content",
	  folder_id:3
    },
  ]
}

// function makeMaliciousBookmark() {
//   const maliciousBookmark = {
//     id: 911,
//     title: 'Naughty naughty very naughty <script>alert("xss");</script>',
//     url: 'https://www.hackers.com',
//     description: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
//     rating: 1,
//   }
//   const expectedBookmark = {
//     ...maliciousBookmark,
//     title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
//     description: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
//   }
//   return {
//     maliciousBookmark,
//     expectedBookmark,
//   }
// }

module.exports = {
  makeFolderArray,
  makeNoteArray,
//   makeMaliciousFolder,
//   makeMaliciousNote
}
