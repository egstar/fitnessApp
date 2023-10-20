
[ Daily Activity Chart ]:
- Dataset( Plan Name )
    * TaskName : [True/False]

[ Weekly Activity Chart ]:
- Dataset ( Week )
    * Overall activity percentage : [COUNT(WEEKTASKSPERCENTAGE)]

[ Overall Tasks Chart ]:
- Dataset ( Task Name )
    * Total Done : [COUNT(TASKSDONE)]

[ Overall Plans Chart ]:
- Dataset ( Plan Name )
    * Done Average : [COUNT(PLANSTASKSDONE)]


get Today's PLANS TASKS if Done or NOT

get plans By Week, 

select COUNT(*) FROM user_plan_tasks where tstatus=1 AND tdate < (SELECT CURRENT_DATE)



userPlans.map((a:any) => {
    new Date(a.planStart) <= new Date() ? console.log(a.pid, a.plan.split('-')[0], a.planStates.totalDone, a.planStates.totalTasks, Object.entries(a.planStates.tasksDone).map((a:any ,b:any) => a[0])) : null
  })

2023-09-20T12:39:02.742Z
2024-03-18T12:39:02.742Z
1800
159

const tillNowDays = Math.ceil((new Date() - new Date('2023-09-22T01:04:27.000Z'))/1000/60/60/24)
const planDays = (new Date('2023-11-11T01:04:27.000Z') - new Date('2023-09-22T01:04:27.000Z'))/1000/60/60/24
const dailyTasksCount = 200 / planDays
const currentTasks = Math.floor(dailyTasksCount * tillNowDays)
console.log((60/currentTasks * 100).toFixed(2))

        <div className='btn btn-sm' onClick={()=> {javascript:(function () { var script = document.createElement('script'); script.src="https://cdn.jsdelivr.net/npm/eruda"; document.body.append(script); script.onload = function () { eruda.init(); } })();}}>Console.log</div>


const leftTime = (newdate) => {
    if(new Date(newdate) < new Date()) return console.log('Plan  ended')
    var planEnds = Math.floor((new Date(new Date(newdate.toString())) - new Date()) / 1000 /  60 / 60 /24)

    var years = Math.floor(planEnds/365)
    var months = Math.floor((planEnds-(years*365))/30)
    var days = Math.floor(planEnds-(years*365)-(months*30))
    console.log(`Years left: ${years}, Months left: ${months}, Days left: ${days} `)

}

Mon Oct 16 2023 00:00:00 GMT+0300 (Eastern European Summer Time)
Mon Oct 16 2023 00:00:00 GMT+0300 (Eastern European Summer Time)