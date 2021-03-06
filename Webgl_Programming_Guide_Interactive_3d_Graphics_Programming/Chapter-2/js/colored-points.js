// 顶点着色器程序
// Vertex shade（顶点着色器）：用来描述顶点特性（如位置、颜色等）
// 顶点是指二维或三维空间中的一个点，比如二维或者三维图像的端点或交点
const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    void main () {
        gl_Position = a_Position; // 设置坐标
        gl_PointSize = 10.0; // 设置尺寸
    }
`

// 片元着色器程序
// Fragment shader（片元着色器）：进行逐片元处理过程，如光照
const FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main () {
        gl_FragColor = u_FragColor; // 设置颜色
    }
`


function main() {
    const canvas = document.getElementById('webgl')
    const gl = getWebGLContext(canvas)

    if (!gl) {
        console.log('Failed to get the rendering context for ThreeJS.')

        return
    }

    // 初始化着色器
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders.')

        return
    }

    // 获取 attribute 变量的存储位置
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position')

    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position')

        return
    }

    // 获取 u_FragColor 变量的存储位置
    const u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor')

    // non-null
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor')

        return
    }

    canvas.addEventListener('click', e => {
        clickHandler(e, gl, canvas, a_Position, u_FragColor)
    }, false)

    // 设置 canvas 的背景色
    gl.clearColor(0.0, 0.0, 0.0, 1.0)

    // 清空 canvas
    gl.clear(gl.COLOR_BUFFER_BIT)
}

const g_points = [] // 鼠标点击位置数组
const g_colors = [] // 存储点颜色的数组
function clickHandler(e, gl, canvas, a_Position, u_FragColor) {
    let {
        clientX: x,
        clientY: y
    } = e
    const rect = e.target.getBoundingClientRect()

    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2)
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2)

    // 将坐标存储到 g_points 数组中
    g_points.push({
        x,
        y
    })

    if (x >= 0.0 && y >= 0.0) { // 第一象限
        g_colors.push([1.0, 0.0, 0.0, 1.0])
    } else if (x < 0.0 && y >= 0.0) { // 第二象限
        g_colors.push([0.0, 1.0, 0.0, 1.0])
    } else if (x < 0.0 && y < 0.0) { // 第三象限
        g_colors.push([0.0, 0.0, 1.0, 1.0])
    } else { // 第四象限
        g_colors.push([1.0, 1.0, 1.0, 1.0])
    }

    // 清空 canvas
    gl.clear(gl.COLOR_BUFFER_BIT)

    const len = g_points.length
    for (let i = 0; i < len; i++) {
        const point = g_points[i]
        const color = g_colors[i]

        // 将顶点位置传输给 attribute 变量
        gl.vertexAttrib3f(a_Position, point.x, point.y, 0.0)
        // 将点的颜色输出到 u_FragColor 变量中
        gl.uniform4f(u_FragColor, color[0], color[1], color[2], color[3])
        // 绘制一个点
        gl.drawArrays(gl.POINTS, 0, 1)
    }
}