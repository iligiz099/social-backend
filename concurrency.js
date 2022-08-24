const numberOfTasks = 100;
const taskList = [...Array(numberOfTasks)].map(() =>
    [...Array(~~(Math.random() * 10 + 3))].map(() =>
        String.fromCharCode(Math.random() * (123 - 97) + 97)
    ).join(''))


var doTask = (taskName) => {
    var begin = Date.now();
    console.log('[task] starts')
    return await new Promise(function (resolve, reject) {
        setTimeout(function () {
            var end = Date.now();
            var timeSpent = (end - begin) + "ms";
            console.log('\x1b[36m', "[TASK] FINISHED: " + taskName + " in " +
                timeSpent, '\x1b[0m');
            resolve(true);
        }, (Math.random() * 200));
    });
};


console.log(doTask(32));
console.log("tedrorodriges2ssswse3@gmail.com");