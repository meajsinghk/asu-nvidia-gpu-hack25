import type { Module as BaseModule } from '@/components/module-card';

export type Module = BaseModule & {
  dataset: {
    title: string;
    description: string;
    variables: string[];
    goal: string;
  };
  code: {
    numpy: string;
    cupy: string;
  }
};

const matrixMultNumpy = `import numpy as np
import time

# This value is fixed for this lab
MATRIX_SIZE = 1000

# Create large random matrices
matrix_a = np.random.rand(MATRIX_SIZE, MATRIX_SIZE).astype(np.float32)
matrix_b = np.random.rand(MATRIX_SIZE, MATRIX_SIZE).astype(np.float32)

# Perform matrix multiplication
start_time = time.time()
result = np.dot(matrix_a, matrix_b)
end_time = time.time()

execution_time = end_time - start_time
print(f"NumPy multiplication for {MATRIX_SIZE}x{MATRIX_SIZE} matrix completed.")
print(f"Execution time: {execution_time:.4f} seconds")`;

const matrixMultCupy = `import cupy as cp
import time

# This value is fixed for this lab
MATRIX_SIZE = 1000

# Create large random matrices on the GPU
matrix_a = cp.random.rand(MATRIX_SIZE, MATRIX_SIZE).astype(cp.float32)
matrix_b = cp.random.rand(MATRIX_SIZE, MATRIX_SIZE).astype(cp.float32)

# Synchronize to start timing accurately
cp.cuda.Stream.null.synchronize()
start_time = time.time()

# Perform matrix multiplication on the GPU
result = cp.dot(matrix_a, matrix_b)

# Wait for the GPU to finish
cp.cuda.Stream.null.synchronize()
end_time = time.time()

execution_time = end_time - start_time
print(f"CuPy multiplication for {MATRIX_SIZE}x{MATRIX_SIZE} matrix completed.")
print(f"Execution time: {execution_time:.4f} seconds")`;


export const modulesData: Module[] = [
  {
    id: '1',
    title: 'Intro to GPU Accelerated Computing',
    description: 'Learn the fundamentals of parallel computing and how GPUs accelerate modern applications.',
    difficulty: 1,
    category: 'General',
    time: 30,
    tags: ['CUDA', 'Basics', 'CuPy'],
    dataset: {
      title: 'Vector Addition',
      description: 'A simple, memory-bound operation. Data transfer overhead can be significant compared to computation time.',
      variables: ['VECTOR_SIZE: 10,000,000', 'vector_a: 10M floats', 'vector_b: 10M floats', 'result: 10M floats'],
      goal: 'Understand the overhead of data transfer between CPU and GPU memory for simple, memory-bound operations.',
    },
    code: {
      numpy: `import numpy as np
import time

VECTOR_SIZE = 10_000_000

vec_a = np.random.rand(VECTOR_SIZE).astype(np.float32)
vec_b = np.random.rand(VECTOR_SIZE).astype(np.float32)

start_time = time.time()
result = vec_a + vec_b
end_time = time.time()

execution_time = end_time - start_time
print(f"CPU vector addition completed.")
print(f"Execution time: {execution_time:.4f} seconds")`,
      cupy: `import cupy as cp
import time

VECTOR_SIZE = 10_000_000

# Host data
h_vec_a = cp.random.rand(VECTOR_SIZE).astype(cp.float32)
h_vec_b = cp.random.rand(VECTOR_SIZE).astype(cp.float32)

# Transfer to device
d_vec_a = cp.asarray(h_vec_a)
d_vec_b = cp.asarray(h_vec_b)

cp.cuda.Stream.null.synchronize()
start_time = time.time()

result = d_vec_a + d_vec_b

cp.cuda.Stream.null.synchronize()
end_time = time.time()

execution_time = end_time - start_time
print(f"GPU vector addition completed.")
print(f"Execution time: {execution_time:.4f} seconds")`,
    }
  },
  {
    id: '2',
    title: 'Matrix Multiplication with CuPy',
    description: 'A hands-on lab comparing the performance of NumPy (CPU) vs. CuPy (GPU) for large matrix operations.',
    difficulty: 2,
    category: 'Scientific Computing',
    time: 45,
    tags: ['CuPy', 'NumPy', 'Performance'],
    prerequisites: ['1'],
    dataset: {
      title: 'Matrix Multiplication',
      description: 'A classic, compute-bound task perfect for parallelization on the GPU.',
      variables: ['MATRIX_SIZE: 1000 (fixed)', 'matrix_a: 1000x1000 float32', 'matrix_b: 1000x1000 float32', 'result: 1000x1000 float32'],
      goal: 'Observe the significant performance difference between CPU and GPU for a compute-intensive task.',
    },
    code: {
      numpy: matrixMultNumpy,
      cupy: matrixMultCupy,
    }
  },
   {
    id: '3',
    title: 'Accelerating DataFrames with cuDF',
    description: 'Explore the rapids.ai ecosystem by using cuDF to perform high-speed data manipulation on the GPU.',
    difficulty: 2,
    category: 'Data Science',
    time: 60,
    tags: ['cuDF', 'Pandas', 'ETL'],
    prerequisites: ['1'],
    dataset: {
        title: 'DataFrame Filtering & GroupBy',
        description: 'Perform a filter and groupby aggregation on a large dataset, a common data science task.',
        variables: ['NUM_ROWS: 5,000,000', 'df: DataFrame with 4 columns', 'filtered_df: DataFrame', 'grouped_df: DataFrame'],
        goal: 'Compare the time taken by Pandas (CPU) and cuDF (GPU) to perform standard DataFrame operations.'
    },
    code: {
        numpy: `import pandas as pd
import numpy as np
import time

NUM_ROWS = 5_000_000
df = pd.DataFrame({
    'x': np.random.randint(0, 100, size=NUM_ROWS),
    'y': np.random.rand(NUM_ROWS) * 100,
})

start_time = time.time()

# Perform filtering and aggregation
filtered_df = df[df['x'] > 50]
grouped_df = filtered_df.groupby('x').y.mean()

end_time = time.time()
execution_time = end_time - start_time
print(f"Pandas execution completed.")
print(f"Execution time: {execution_time:.4f} seconds")`,
        cupy: `import cudf
import cupy as cp
import time

NUM_ROWS = 5_000_000
gdf = cudf.DataFrame({
    'x': cp.random.randint(0, 100, size=NUM_ROWS),
    'y': cp.random.rand(NUM_ROWS) * 100,
})

cp.cuda.Stream.null.synchronize()
start_time = time.time()

# Perform filtering and aggregation
filtered_gdf = gdf[gdf['x'] > 50]
grouped_gdf = filtered_gdf.groupby('x').y.mean()

cp.cuda.Stream.null.synchronize()
end_time = time.time()
execution_time = end_time - start_time
print(f"cuDF execution completed.")
print(f"Execution time: {execution_time:.4f} seconds")`,
    }
  },
  {
    id: '4',
    title: 'Building a Simple Neural Network',
    description: 'Implement a basic neural network from scratch using CuPy to understand the GPU\'s role in deep learning.',
    difficulty: 3,
    category: 'Deep Learning',
    time: 90,
    tags: ['CuPy', 'AI', 'Neural Networks'],
    prerequisites: ['2'],
    dataset: {
        title: 'Neural Network Training Step',
        description: 'A single forward and backward pass for a small neural network on random data.',
        variables: ['N_SAMPLES: 64', 'N_FEATURES: 784', 'N_HIDDEN: 256', 'N_CLASSES: 10', 'weights, biases, etc.'],
        goal: 'See how the parallel nature of matrix multiplications in neural networks makes them ideal for GPUs.'
    },
    code: {
        numpy: `import numpy as np
import time

# Hyperparameters
N_SAMPLES, N_FEATURES, N_HIDDEN, N_CLASSES = 64, 784, 256, 10

# Model weights
w1 = np.random.randn(N_FEATURES, N_HIDDEN).astype(np.float32)
b1 = np.zeros(N_HIDDEN, dtype=np.float32)
w2 = np.random.randn(N_HIDDEN, N_CLASSES).astype(np.float32)
b2 = np.zeros(N_CLASSES, dtype=np.float32)

# Input data
x = np.random.randn(N_SAMPLES, N_FEATURES).astype(np.float32)

start_time = time.time()
# Forward pass
z1 = x @ w1 + b1
a1 = np.maximum(0, z1) # ReLU
z2 = a1 @ w2 + b2

# Backward pass (simplified)
grad_z2 = z2 - np.random.randn(N_SAMPLES, N_CLASSES)
grad_w2 = a1.T @ grad_z2
end_time = time.time()
execution_time = end_time - start_time
print(f"CPU training step completed.")
print(f"Execution time: {execution_time:.4f} seconds")`,
        cupy: `import cupy as cp
import time

# Hyperparameters
N_SAMPLES, N_FEATURES, N_HIDDEN, N_CLASSES = 64, 784, 256, 10

# Model weights
w1 = cp.random.randn(N_FEATURES, N_HIDDEN).astype(cp.float32)
b1 = cp.zeros(N_HIDDEN, dtype=cp.float32)
w2 = cp.random.randn(N_HIDDEN, N_CLASSES).astype(cp.float32)
b2 = cp.zeros(N_CLASSES, dtype=cp.float32)

# Input data
x = cp.random.randn(N_SAMPLES, N_FEATURES).astype(cp.float32)

cp.cuda.Stream.null.synchronize()
start_time = time.time()
# Forward pass
z1 = x @ w1 + b1
a1 = cp.maximum(0, z1) # ReLU
z2 = a1 @ w2 + b2

# Backward pass (simplified)
grad_z2 = z2 - cp.random.randn(N_SAMPLES, N_CLASSES)
grad_w2 = a1.T @ grad_z2

cp.cuda.Stream.null.synchronize()
end_time = time.time()
execution_time = end_time - start_time
print(f"GPU training step completed.")
print(f"Execution time: {execution_time:.4f} seconds")`,
    }
  },
  {
    id: '5',
    title: 'GPU Memory Management',
    description: 'Dive deep into CUDA memory spaces, understanding global, shared, and constant memory.',
    difficulty: 1,
    category: 'General',
    time: 75,
    tags: ['CUDA', 'Memory', 'Optimization'],
    dataset: {
        title: 'Data Transfer vs. In-Place Operation',
        description: 'Compare the time it takes to transfer data vs. performing a simple operation on data already on the GPU.',
        variables: ['ARRAY_SIZE: 50,000,000', 'data: 50M floats'],
        goal: 'Illustrate that data transfer between CPU and GPU can be a bottleneck and should be minimized.'
    },
    code: {
        numpy: `import numpy as np
import time

ARRAY_SIZE = 50_000_000
data = np.random.rand(ARRAY_SIZE).astype(np.float32)

# This is a placeholder on the CPU side.
# The focus here is the GPU's data transfer time.
start_time = time.time()
result = data * 5
end_time = time.time()

execution_time = end_time - start_time
print(f"CPU equivalent operation completed.")
print(f"Execution time: {execution_time:.4f} seconds")`,
        cupy: `import cupy as cp
import time

ARRAY_SIZE = 50_000_000
host_data = np.random.rand(ARRAY_SIZE).astype(np.float32)

# Time the data transfer
start_transfer = time.time()
device_data = cp.asarray(host_data)
cp.cuda.Stream.null.synchronize()
end_transfer = time.time()

# Time the computation
start_compute = time.time()
result = device_data * 5
cp.cuda.Stream.null.synchronize()
end_compute = time.time()

print(f"GPU Data Transfer Time: {(end_transfer-start_transfer):.4f}s")
print(f"GPU Compute Time: {(end_compute-start_compute):.4f}s")`,
    }
  },
    {
    id: '6',
    title: 'Advanced Kernel Fusion',
    description: 'Learn how to fuse multiple GPU operations into a single kernel for maximum performance.',
    difficulty: 3,
    category: 'Scientific Computing',
    time: 120,
    tags: ['CuPy', 'Kernels', 'Optimization'],
    prerequisites: ['2', '5'],
    dataset: {
        title: 'Fused vs. Unfused Operations',
        description: 'Compare separate simple math operations against a single fused kernel performing the same work.',
        variables: ['ARRAY_SIZE: 20,000,000', 'x, y, z: 20M float arrays'],
        goal: 'Demonstrate how kernel fusion reduces memory access and overhead, leading to significant speedups.'
    },
    code: {
        numpy: `import numpy as np
import time

# On the CPU, operations are not 'fused' in the same way.
# This serves as a baseline.
ARRAY_SIZE = 20_000_000
x = np.random.rand(ARRAY_SIZE).astype(np.float32)
y = np.random.rand(ARRAY_SIZE).astype(np.float32)

start_time = time.time()
# result = (x * 2) + (y / 2)
a = x * 2
b = y / 2
result = a + b
end_time = time.time()

execution_time = end_time - start_time
print(f"CPU (unfused) execution completed.")
print(f"Execution time: {execution_time:.4f} seconds")`,
        cupy: `import cupy as cp
import time

ARRAY_SIZE = 20_000_000
x = cp.random.rand(ARRAY_SIZE).astype(cp.float32)
y = cp.random.rand(ARRAY_SIZE).astype(cp.float32)

# Custom kernel for fusion
add_vectors = cp.ElementwiseKernel(
   'float32 x, float32 y',
   'float32 z',
   'z = (x * 2) + (y / 2)',
   'add_vectors')

cp.cuda.Stream.null.synchronize()
start_time = time.time()

# Fused operation
result_fused = add_vectors(x, y)

cp.cuda.Stream.null.synchronize()
end_time = time.time()
execution_time = end_time - start_time
print(f"GPU (fused) execution completed.")
print(f"Execution time: {execution_time:.4f} seconds")`,
    }
  },
];
