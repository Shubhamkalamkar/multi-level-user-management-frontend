import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink } from '@angular/router';

interface UserNode {
  _id: string;
  username: string;
  role: string;
  balance: number;
  parentId: string | null;
  children?: UserNode[];
}

@Component({
  selector: 'app-hierarchy',
  standalone: true,
  imports: [
    CommonModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    RouterLink
  ],
  templateUrl: './hierarchy.html',
  styleUrl: './hierarchy.css'
})
export class Hierarchy implements OnInit {
  treeControl = new NestedTreeControl<UserNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<UserNode>();
  isLoading = true;
  isAdmin = false;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {
    this.isAdmin = this.authService.currentUser()?.role === 'Admin';
  }

  ngOnInit(): void {
    this.loadHierarchy();
  }

  loadHierarchy(): void {
    this.userService.getDownline().subscribe({
      next: (res) => {
        if (res.success) {
          const treeData = this.buildTree(res.data);
          this.treeControl = new NestedTreeControl<UserNode>(node => node.children);
          this.dataSource = new MatTreeNestedDataSource<UserNode>();
          this.dataSource.data = treeData;
          this.treeControl.dataNodes = treeData;
          this.treeControl.expandAll();
          this.isLoading = false;
        }
      },
      error: () => this.isLoading = false
    });
  }

  buildTree(flatData: any[]): UserNode[] {
    const map = new Map<string, UserNode>();
    const roots: UserNode[] = [];

    // First pass: initialize map
    flatData.forEach(item => {
      // parentId could be an object if populated
      const pid = item.parentId?._id || item.parentId;
      map.set(item._id, { ...item, parentId: pid, children: [] });
    });

    // Second pass: build tree
    flatData.forEach(item => {
      const pid = item.parentId?._id || item.parentId;
      const node = map.get(item._id);
      
      if (pid && map.has(pid)) {
        // Child node
        map.get(pid)?.children?.push(node!);
      } else {
        // Root node (for this user's perspective)
        roots.push(node!);
      }
    });

    return roots;
  }

  hasChild = (_: number, node: UserNode) => !!node.children && node.children.length > 0;
}
