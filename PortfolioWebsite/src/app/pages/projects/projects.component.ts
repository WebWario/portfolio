import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { NgClass } from '@angular/common';
import {ResourceManagerService} from '../../misc/resource-manager';
import {RefService} from '../../sections/canva-background/ref-service';
import {CanvaBackgroundComponent} from '../../sections/canva-background/canva-background.component';
import {GraphicNode} from '../../sections/canva-background/canva-models';
import {Router, RouterOutlet} from '@angular/router';
import {TxtFieldService} from '../../components/txt-field/txt-field-service';
import {LoggerService, SERVICELOGLEVEL} from '../../misc/logger/logger-service';
import {MapLegendComponent} from '../../components/map-legend/map-legend.component';
import {TxtFieldComponent} from '../../components/txt-field/txt-field.component';
import {UserInfoComponent} from '../../components/user-info/user-info.component';
import {SwitchingTextComponent} from '../../components/switching-text/switching-text.component';
import {FloatingLogosComponent} from '../../components/floating-logos/floating-logos.component';

@Component({
  selector: 'app-projects',
  imports: [CanvaBackgroundComponent, NgClass, RouterOutlet, MapLegendComponent, UserInfoComponent, SwitchingTextComponent, FloatingLogosComponent, TxtFieldComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent implements OnInit, AfterViewInit {

  // TODO: move txtstyle and legendstyle to .json
  TXTSTYLE = {
    "font-family": "gagalin",
    "font-size": "small",
    "color": "var(--onyx)"
  }

  readonly INITIALSELECTIONKEY: string | number = 1;

  readonly INITIALNODECOLOR: string = "#ffffff";

  readonly SELECTIONCOLOR: string = "#DB3069";

  readonly HOVERCOLOR: string = "#1446A0";

  LEGENDSTYLE = (color: string) => {
    return {
      "border-bottom": `5px solid ${color}`,
      "position": "relative",
      "bottom": "50%",
      "width": "inherit"
    }
  }

  // TODO: directly pull from SCSS
  UNISTYLE = "#3C3C3B";
  LABSTYLE = "#1446A0";
  MEDSTYLE = "#DB3069";
  CUSTOMER = "#F5D547";

  LEGENDENTRIES = {
    "customer": {
      name: "Customer",
      textStyle: this.TXTSTYLE,
      legendStyle: this.LEGENDSTYLE(this.CUSTOMER)
    },
    "uni": {
      name: "University",
      textStyle: this.TXTSTYLE,
      legendStyle: this.LEGENDSTYLE(this.UNISTYLE),
    },
    "citylab": {
      name: "Research",
      textStyle: this.TXTSTYLE,
      legendStyle: this.LEGENDSTYLE(this.LABSTYLE)
    },
    "seppmed": {
      name: "Product Dev.",
      textStyle: this.TXTSTYLE,
      legendStyle: this.LEGENDSTYLE(this.MEDSTYLE)
    },
  };

  @ViewChildren('nodes')
  gNodes!: QueryList<any>;

  GRAPHICNODES = ['pages', 'lineNodes'];

  LISTNAME = 'projectRefs'

  txtFields: { [key: number | string]: any } = {};

  graphicNodes: GraphicNode[] = [];

  selected: { txtField: any, title: string | number } = {
    txtField: undefined,
    title: ''
  };

  isInitialEnter: boolean = true;

  arrowdown: boolean = true;

  toggleArrow() {
    this.arrowdown = !this.arrowdown
  }

  @ViewChild('profilePic')
  profilePic!: ElementRef;

  @ViewChild('landing')
  landingRef!: ElementRef;

  @ViewChild('projectMap')
  projectMapRef!: ElementRef;

  @ViewChild('floatingLogo')
  floatingLogoRef!: ElementRef;

  private navigationHistory: { txtField: any, title: string | number }[] = []

  private lastVisited!: { txtField: any, title: string | number};

  /**
   * The title / id of the gnode currently colored
   * */
  colored?: string | number;

  /**
   * The title / id of the gnode currently hovered over
   * */
  _hovered?: string | number;

  set hovered(id: string | number | undefined) {
    this._hovered = id;
  }

  get hovered(): string | number | undefined {
    return this._hovered
  }

  _outletIsExpanded: boolean = false;

  set outletIsExpanded(val: boolean) {
    this._outletIsExpanded = val;
  }

  constructor(
    private rscMng: ResourceManagerService,
    private refService: RefService,
    private router: Router,
    private txtFieldService: TxtFieldService,
    private logger: LoggerService
  ) {
  }

  onArrowNavigation() {
    // checking on profile pic as a center element of the landingref element
    // landing ref isInView is brittle because it height > view height
    const refArr = [this.profilePic, this.floatingLogoRef, this.projectMapRef]
    let refInView;
    for (const ref of refArr) {
      if (this.isInView(ref)) {
        refInView = ref;
        break;
      }
    }
    switch (refInView) {
      case this.profilePic:
        this.navigateToNextRef(this.projectMapRef, undefined);
        break;
      case this.floatingLogoRef:
        this.navigateToNextRef(undefined, this.projectMapRef);
        break;
      case this.projectMapRef:
        this.navigateToNextRef(this.floatingLogoRef, this.landingRef);
        break;
    }
  }

  private navigateToNextRef(nextRef?: ElementRef, previousRef?: ElementRef) {
    if (this.arrowdown && nextRef) {
      nextRef.nativeElement.scrollIntoView({behavior: "smooth"})
    } else {
      if (previousRef) {
        previousRef.nativeElement.scrollIntoView({behavior: "smooth"})
      }
    }
  }

  @ViewChildren('box')
  boxes!: QueryList<ElementRef>;

  assignHoverColor(graphicNode: GraphicNode) {
    if(this.colored === graphicNode.id){
      return;
    }
    this.hovered = graphicNode.id;
    let curHoverElement = this.findHoveredBoxElementRef(graphicNode.id);
    if(curHoverElement){
      curHoverElement.nativeElement.style.backgroundColor = this.HOVERCOLOR;
    }
  }

  findHoveredBoxElementRef (id: number | string): ElementRef | undefined{
    return this.boxes!.find(e => e.nativeElement.id === id);
  }

  removeHover(id: string | number) {
    let curHoverElement = this.findHoveredBoxElementRef(id);
    if(curHoverElement && (this.colored !== id)){
      curHoverElement.nativeElement.style.backgroundColor = this.INITIALNODECOLOR;
    }
    this.hovered = undefined;
  }

  isInView(elem: ElementRef) {
    const rect = elem.nativeElement.getBoundingClientRect()
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  private navigateToNext() {
    // not optimal - sorting on each navigation is cheap because there is only a handful
    const sortedKeys: string[] = Object.keys(this.txtFields).sort();
    const next: number = (sortedKeys.indexOf(this.selected.title.toString()) + 1) % sortedKeys.length;
    let key: string = sortedKeys[next]
    const nextElem = {
      title: key, txtField: this.txtFields[key]
    }
    this.selected = nextElem;
    this.navigateTo();
    this.pushToHistory(nextElem);
  }

  private pushToHistory(elem: { txtField: any, title: string | number}) {

    if (!this.navigationHistory.some(val => val.title === elem.title)) {
      this.navigationHistory.push(elem)
    }
  }

  private popFromHistory(): { txtField: any, title: string | number } | undefined {
    return this.navigationHistory.pop()
  }

  ngAfterViewInit(): void {
    this.gNodes!.changes.subscribe(
      gNode =>
        this.refService.registerElementRef(this.LISTNAME, gNode)
    );
    const initialTxtField = this.txtFields[1]
    this.selected = {txtField: initialTxtField, title: initialTxtField.title}
  }

  mouseEnter() {
    if (this.isInitialEnter) {
      this.selected.txtField = this.txtFields[this.INITIALSELECTIONKEY];
      this.selected.title = this.INITIALSELECTIONKEY.toString()
      this.isInitialEnter = false;
    } else {
      this.selected.txtField = this.lastVisited.txtField;
      this.selected.title = this.lastVisited.title;
    }
    this.navigateTo()
    this.outletIsExpanded = true;
  }

  onRouterOutletActivate(event: any) {
    if (!(event instanceof TxtFieldComponent)) {
      this.logger.log('Event not of type text field.', SERVICELOGLEVEL.Debug);
      return;
    }
    (event as TxtFieldComponent).closed.subscribe(val => {
      this.outletIsExpanded = !val;
      this.router.navigate([this.removeUrlTail()]);
      this.colored = undefined;
    });
    (event as TxtFieldComponent).navigate.subscribe(val => {
      if (val === "next") {
        this.navigateToNext()
      } else {
        if (this.navigationHistory.length > 0) {
          this.navigateTo(this.popFromHistory())
        }
      }
    })
  }

  ngOnInit(): void {
    this.rscMng.toGraphicNode(this.GRAPHICNODES).then(nodeObj => {
      this.graphicNodes = nodeObj as any;
      this.graphicNodes.forEach(node => {
        const cur = (node as any);
        if (cur.hasOwnProperty('txtField') && cur.hasOwnProperty('id') && cur['txtField'] != undefined) {
          this.txtFields[cur.id] = cur['txtField'];
          this.txtFieldService.projectTxtFields[cur.id] = cur['txtField'];
        }
      });
    });
    addEventListener("scroll", (event) => {
      this.toggleForInView();
    });
  }

  private toggleForInView() {
    if (this.isInView(this.profilePic)) {
      if (!this.arrowdown) {
        this.toggleArrow()
      }
    } else if (this.isInView(this.floatingLogoRef)) {
      if (this.arrowdown) {
        this.toggleArrow()
      }
    }
  }

  private targetInTxtFields(target: HTMLElement) {
    return this.txtFields[target.title]
  }

  onMouseDown(event: MouseEvent) {
    const target = event.currentTarget as HTMLElement;
    // canva contains nodes that are not txtfields.
    if (this.targetInTxtFields(target)) {
      const historyElem = {title: this.selected.title, txtField: this.selected.txtField}
      this.pushToHistory(historyElem)
      if (this.selected.txtField) {
        this.changeNodeColor(this.selected.title, this.INITIALNODECOLOR);
      }

      this.selected.title = target.title;
      this.selected.txtField = this.txtFields[this.selected.title];
      this.navigateTo();
      this.outletIsExpanded = true;
    }
  }

  changeNodeColor(nodeTitle: number | string, color: string) {
    if (!nodeTitle) {
      return;
    }
    let curNode = this.gNodes.toArray().find((e: any) => e.nativeElement.title === nodeTitle);
    if (curNode) {
      this.colored = nodeTitle;
    }
  }

  onLeave() {
    this.outletIsExpanded = false;
    this.colored = undefined;
    this.router.navigate([this.removeUrlTail()])
  }

  /**
   * Navigates to the selection if it is passed. Otherwise tries to navigate to this.selected.
   * If neither exists logs and returns without action.
   * */
  protected navigateTo(selection?: { txtField: any; title: string | number }) {
    let cur: { txtField: any, title: string | number};
    if (selection != undefined) {
      cur = selection;
    } else if (this.selected.txtField) {
      cur = this.selected;
    } else {
      return;
    }
    this.changeNodeColor(cur.title, this.SELECTIONCOLOR);
    this.lastVisited = cur;
    this.router.navigate(
      //@ts-ignore
      [`${this.removeUrlTail()}/${cur.title}`],
      {
        queryParams: [{
          txtField: cur.txtField
        }]
      }
    )
  }

  private removeUrlTail(): string {
    // Get the base route without any child routes
    const urlParts = this.router.url.split('/');
    // If we're on the root path or only have one segment, return '/'
    if (urlParts.length <= 1 || (urlParts.length === 2 && urlParts[1] === '')) {
      return '/';
    }
    // Otherwise return the first segment (which should be 'home' based on our routes)
    return '/';
  }
}
