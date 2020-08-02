// // function test() {
// //   console.log('hello world')
// // }

// // test()

// // function fun1() {
// //   fun2()
// // }

// // function fun2() {
// //   try {
// //     fun3()
// //   } catch (error) {}
// // }

// // console.log(fun3()) //success
// // //在js中1/0是合法的，
// // function fun3() {
// //   try {
// //     1 / 0
// //     console.log(1 / 0) //Infinity无穷大
// //   } catch (error) {
// //     throw error
// //   }
// //   return 'success'
// // }

// //出现异常
// //return false / null
// //throw new Error

// //全局异常处理
// // 在所有函数调用的最顶部，注册监听机制，监听所有的异常
// //try catch只对同步有效

// //异步编程  处理异常
// //使用async  await简化异常链条，前提函数返回的是Promise
// //所有的函数全部都要加上async  await，否则会出现Promise未处理的异常
// //必须是异步函数的Promise包装
// async function fun4() {
//   try {
//     console.log(await fun5())
//   } catch (error) {
//     console.log('error')
//   }
// }
// function fun5() {
//   // await setTimeout(() => {
//   //   throw new Error('error')
//   // }, 1000)

//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       const r = Math.random()
//       if (r < 0.5) {
//         reject()
//       }
//     }, 1000)
//   })
// }

// fun4()

// //await相当于是释放了Promise中的异常，await把异常有threw，执行catch内的代码
// //不加await，相当于是Promise产生了一个未处理的异常
// //报错：Promise中产生异常，外部未处理
// //DeprecationWarning: Unhandled promise rejections are deprecated.
// // In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.

setTimeout(() => {
  console.log(1)
  Promise.resolve().then(() => {
    console.log(2)
  })
})
setTimeout(() => {
  console.log(3)
  Promise.resolve().then(() => {
    console.log(4)
  })
})
setImmediate(() => {
  console.log(5)
  Promise.resolve().then(() => {
    console.log(6)
  })
})
setImmediate(() => {
  console.log(7)
  Promise.resolve().then(() => {
    console.log(8)
  })
})
