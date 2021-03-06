// 顶点着色器程序
// Vertex shade（顶点着色器）：用来描述顶点特性（如位置、颜色等）
// 顶点是指二维或三维空间中的一个点，比如二维或者三维图像的端点或交点
const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    void main () {
        gl_Position = a_Position; // 设置坐标
    }
`

// 片元着色器程序
// Fragment shader（片元着色器）：进行逐片元处理过程，如光照
const FSHADER_SOURCE = `
    precision mediump float;
    uniform float u_Width;
    uniform float u_Height;
    void main () {
        gl_FragColor = vec4(gl_FragCoord.x / u_Width, 0.0, gl_FragCoord.y / u_Height, 1.0); // 设置颜色
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

    // 设置顶点位置
    let n = initVertexBuffers(gl)

    if (n < 0) {
        console.log('Failed to set the positions of the vertices')

        return
    }

    // 设置 canvas 的背景色
    gl.clearColor(0.0, 0.0, 0.0, 1.0)

    // 清空 canvas
    gl.clear(gl.COLOR_BUFFER_BIT)

    // 绘制三角形
    gl.drawArrays(gl.TRIANGLES, 0, n)
    // 绘制线段，(v0, v1)、(v2, v3)...如果点是奇数，最后一个抛弃
    // gl.drawArrays(gl.LINES, 0, n)
    // 绘制线段，(v0, v1)、(v1, v2)...
    // gl.drawArrays(gl.LINE_STRIP, 0, n)
    // 绘制线段，(v0, v1)、(v1, v2)...(vn, v0)，最后一个点连第一个点
    // gl.drawArrays(gl.LINE_LOOP, 0, n)
}

function initVertexBuffers(gl) {
    const vertices = new Float32Array([
        0.0, 0.5, -0.5, -0.5, 0.5, -0.5
    ])
    const n = 3
    const vertexBuffer = gl.createBuffer()

    if (!vertexBuffer) {
        console.log('Failed to create the buffer object')

        return -1
    }

    // 将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)

    // 向缓冲区对象中写入数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)


    // 获取 attribute 变量的存储位置
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position')

    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position')

        return
    }

    // 将缓冲区对象分配给 a_Position 变量
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)

    const u_Width = gl.getUniformLocation(gl.program, 'u_Width')
    if (!u_Width) {
        console.log('Failed to get the storage location of u_Width')

        return
    }

    const u_Height = gl.getUniformLocation(gl.program, 'u_Height')
    if (!u_Height) {
        console.log('Failed to get the storage location of u_Height')

        return
    }

    // Pass the width and hight of the <canvas>
    gl.uniform1f(u_Width, gl.drawingBufferWidth)
    gl.uniform1f(u_Height, gl.drawingBufferHeight)

    // 连接 a_Position 变量与分配给它缓冲区对象
    gl.enableVertexAttribArray(a_Position)

    // Unbind the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, null)

    return n
}