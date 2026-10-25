import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const categories = [
  { name: 'Calculus I', slug: 'calculus-i' },
  { name: 'Physics Mechanics', slug: 'physics-mechanics' },
  { name: 'Accounting Basics', slug: 'accounting-basics' },
  { name: 'Data Structures', slug: 'data-structures' },
  { name: 'Linear Algebra', slug: 'linear-algebra' },
  { name: 'Discrete Mathematics', slug: 'discrete-mathematics' },
]

const calculusContent = `<h1>Introduction to Limits</h1>
<p>A <strong>limit</strong> describes the value a function approaches as the input approaches a specific value. It is the foundation of calculus.</p>
<h2>Formal Definition</h2>
<p>We say the limit of <em>f(x)</em> as <em>x</em> approaches <em>a</em> equals <em>L</em>, written:</p>
<pre><code>$$\\lim_{x \\to a} f(x) = L$$</code></pre>
<p>if for every ε &gt; 0 there exists δ &gt; 0 such that:</p>
<pre><code>$$0 &lt; |x - a| &lt; \\delta \\implies |f(x) - L| &lt; \\varepsilon$$</code></pre>
<h2>Basic Limit Laws</h2>
<p>If $\\lim_{x \\to a} f(x) = L$ and $\\lim_{x \\to a} g(x) = M$ then:</p>
<ul>
<li><strong>Sum rule:</strong> $\\lim_{x \\to a}[f(x) + g(x)] = L + M$</li>
<li><strong>Product rule:</strong> $\\lim_{x \\to a}[f(x) \\cdot g(x)] = L \\cdot M$</li>
<li><strong>Quotient rule:</strong> $\\lim_{x \\to a}\\frac{f(x)}{g(x)} = \\frac{L}{M}$, provided $M \\neq 0$</li>
</ul>
<h2>Important Limit</h2>
<p>One of the most important limits in calculus:</p>
<pre><code>$$\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$$</code></pre>
<h2>Example: Finding a Limit</h2>
<p>Evaluate $\\lim_{x \\to 2}(3x^2 - 4x + 1)$.</p>
<p>Since this is a polynomial, we can substitute directly:</p>
<pre><code>$$3(2)^2 - 4(2) + 1 = 12 - 8 + 1 = 5$$</code></pre>
<p>Therefore, $\\lim_{x \\to 2}(3x^2 - 4x + 1) = 5$.</p>
<h2>L'Hôpital's Rule</h2>
<p>For indeterminate forms $\\frac{0}{0}$ or $\\frac{\\infty}{\\infty}$:</p>
<pre><code>$$\\lim_{x \\to a} \\frac{f(x)}{g(x)} = \\lim_{x \\to a} \\frac{f'(x)}{g'(x)}$$</code></pre>
<p>This rule is extremely useful when direct substitution fails.</p>`

const physicsContent = `<h1>Newton's Laws of Motion</h1>
<p>Newton's three laws of motion form the foundation of classical mechanics. They describe the relationship between a body and the forces acting on it.</p>
<h2>First Law — Inertia</h2>
<p>An object at rest stays at rest, and an object in motion stays in motion with the same speed and direction unless acted upon by an unbalanced force.</p>
<h2>Second Law — Force and Acceleration</h2>
<p>The net force on an object equals its mass multiplied by its acceleration:</p>
<pre><code>$$\\vec{F}_{net} = m\\vec{a}$$</code></pre>
<p>Equivalently, using momentum $\\vec{p} = m\\vec{v}$:</p>
<pre><code>$$\\vec{F}_{net} = \\frac{d\\vec{p}}{dt}$$</code></pre>
<h2>Third Law — Action and Reaction</h2>
<p>For every action there is an equal and opposite reaction. If object A exerts force $\\vec{F}_{AB}$ on object B, then object B exerts $\\vec{F}_{BA} = -\\vec{F}_{AB}$ on A.</p>
<h2>Kinematics Equations (Constant Acceleration)</h2>
<ul>
<li>$v = v_0 + at$</li>
<li>$x = x_0 + v_0 t + \\frac{1}{2}at^2$</li>
<li>$v^2 = v_0^2 + 2a(x - x_0)$</li>
</ul>
<h2>Example: Projectile Motion</h2>
<p>A ball is thrown horizontally at $v_0 = 15\\,\\text{m/s}$ from a height of $h = 20\\,\\text{m}$. Find the time to hit the ground and the horizontal distance.</p>
<p><strong>Vertical motion</strong> (free fall, $g = 9.8\\,\\text{m/s}^2$):</p>
<pre><code>$$h = \\frac{1}{2}gt^2 \\implies t = \\sqrt{\\frac{2h}{g}} = \\sqrt{\\frac{40}{9.8}} \\approx 2.02\\,\\text{s}$$</code></pre>
<p><strong>Horizontal distance:</strong></p>
<pre><code>$$x = v_0 t = 15 \\times 2.02 \\approx 30.3\\,\\text{m}$$</code></pre>`

const dsContent = `<h1>Binary Search Trees</h1>
<p>A <strong>Binary Search Tree (BST)</strong> is a binary tree data structure where each node satisfies the BST property: the left subtree contains only nodes with keys less than the node's key, and the right subtree contains only nodes with keys greater.</p>
<h2>BST Property</h2>
<p>For every node <em>N</em> with key <em>k</em>:</p>
<ul>
<li>All keys in the <strong>left subtree</strong> are &lt; <em>k</em></li>
<li>All keys in the <strong>right subtree</strong> are &gt; <em>k</em></li>
</ul>
<h2>Time Complexities</h2>
<p>For a balanced BST with <em>n</em> nodes:</p>
<ul>
<li><strong>Search:</strong> $O(\\log n)$ average, $O(n)$ worst case</li>
<li><strong>Insert:</strong> $O(\\log n)$ average, $O(n)$ worst case</li>
<li><strong>Delete:</strong> $O(\\log n)$ average, $O(n)$ worst case</li>
<li><strong>In-order traversal:</strong> $O(n)$</li>
</ul>
<h2>BST Search — TypeScript</h2>
<pre><code class="language-typescript">interface TreeNode {
  key: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

function search(root: TreeNode | null, target: number): TreeNode | null {
  if (root === null || root.key === target) {
    return root;
  }
  if (target &lt; root.key) {
    return search(root.left, target);
  }
  return search(root.right, target);
}</code></pre>
<h2>BST Insertion</h2>
<pre><code class="language-typescript">function insert(root: TreeNode | null, key: number): TreeNode {
  if (root === null) {
    return { key, left: null, right: null };
  }
  if (key &lt; root.key) {
    root.left = insert(root.left, key);
  } else if (key &gt; root.key) {
    root.right = insert(root.right, key);
  }
  // duplicate keys are ignored
  return root;
}</code></pre>
<h2>In-Order Traversal</h2>
<p>In-order traversal of a BST produces keys in <strong>sorted order</strong>:</p>
<pre><code class="language-typescript">function inOrder(node: TreeNode | null, result: number[] = []): number[] {
  if (node !== null) {
    inOrder(node.left, result);
    result.push(node.key);
    inOrder(node.right, result);
  }
  return result;
}</code></pre>
<h2>Balancing</h2>
<p>To avoid worst-case $O(n)$ performance, self-balancing BSTs such as <strong>AVL trees</strong> or <strong>Red-Black trees</strong> maintain $O(\\log n)$ height guarantees by performing rotations after insertions and deletions.</p>`

const accountingContent = `<h1>The Accounting Equation and Double-Entry Bookkeeping</h1>
<p>The foundation of all accounting is the <strong>accounting equation</strong>:</p>
<pre><code>$$\\text{Assets} = \\text{Liabilities} + \\text{Equity}$$</code></pre>
<p>This equation must always remain balanced. Every financial transaction affects at least two accounts — this is the basis of <strong>double-entry bookkeeping</strong>.</p>
<h2>Key Account Types</h2>
<ul>
<li><strong>Assets:</strong> Resources owned by the business (cash, inventory, equipment)</li>
<li><strong>Liabilities:</strong> Obligations owed to creditors (loans, accounts payable)</li>
<li><strong>Equity:</strong> Owner's residual claim (capital, retained earnings)</li>
<li><strong>Revenue:</strong> Income generated from business operations</li>
<li><strong>Expenses:</strong> Costs incurred to generate revenue</li>
</ul>
<h2>Debit and Credit Rules</h2>
<p>Every transaction has equal debits and credits:</p>
<ul>
<li><strong>Assets:</strong> Debit increases, Credit decreases</li>
<li><strong>Liabilities:</strong> Debit decreases, Credit increases</li>
<li><strong>Equity:</strong> Debit decreases, Credit increases</li>
<li><strong>Revenue:</strong> Debit decreases, Credit increases</li>
<li><strong>Expenses:</strong> Debit increases, Credit decreases</li>
</ul>
<h2>Example Journal Entry</h2>
<p>A business purchases office supplies for $500 cash:</p>
<pre><code>Date        Account              Debit    Credit
─────────────────────────────────────────────────
Jan 5       Office Supplies      $500
              Cash                         $500
            (Purchased supplies for cash)</code></pre>
<h2>The Income Statement</h2>
<pre><code>$$\\text{Net Income} = \\text{Total Revenue} - \\text{Total Expenses}$$</code></pre>
<p>A positive net income means the business is profitable. This net income flows into the equity section of the balance sheet.</p>`

async function main() {
  console.log('🌱 Seeding database...')

  // Create categories
  const categoryRecords: Record<string, { id: string }> = {}
  for (const cat of categories) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
    categoryRecords[cat.slug] = record
    console.log(`  ✓ Category: ${cat.name}`)
  }

  // Create users
  const password1 = await bcrypt.hash('demo1234', 12)
  const password2 = await bcrypt.hash('demo1234', 12)

  const user1 = await prisma.user.upsert({
    where: { usernameLower: 'demo1' },
    update: {},
    create: {
      username: 'demo1',
      usernameLower: 'demo1',
      passwordHash: password1,
    },
  })
  console.log(`  ✓ User: demo1 (password: demo1234)`)

  const user2 = await prisma.user.upsert({
    where: { usernameLower: 'demo2' },
    update: {},
    create: {
      username: 'demo2',
      usernameLower: 'demo2',
      passwordHash: password2,
    },
  })
  console.log(`  ✓ User: demo2 (password: demo1234)`)

  // Create materials
  const materials = [
    {
      title: 'Introduction to Limits',
      content: calculusContent,
      status: 'PUBLISHED',
      authorId: user1.id,
      categoryId: categoryRecords['calculus-i'].id,
    },
    {
      title: "Newton's Laws of Motion",
      content: physicsContent,
      status: 'PUBLISHED',
      authorId: user1.id,
      categoryId: categoryRecords['physics-mechanics'].id,
    },
    {
      title: 'Binary Search Trees',
      content: dsContent,
      status: 'PUBLISHED',
      authorId: user2.id,
      categoryId: categoryRecords['data-structures'].id,
    },
    {
      title: 'The Accounting Equation and Double-Entry Bookkeeping',
      content: accountingContent,
      status: 'PUBLISHED',
      authorId: user2.id,
      categoryId: categoryRecords['accounting-basics'].id,
    },
  ]

  for (const mat of materials) {
    await prisma.material.create({ data: mat })
    console.log(`  ✓ Material: ${mat.title}`)
  }

  console.log('\n✅ Seeding complete!')
  console.log('   Login with: demo1 / demo1234  or  demo2 / demo1234')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
